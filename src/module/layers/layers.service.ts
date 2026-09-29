import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, ILike, In, Repository } from 'typeorm';
import {
  BatchLayerDto,
  CreateLayerDto,
  LAYER_SEARCH_WHITELIST,
  LayerDto,
  LayerQueryDto,
  UpdateLayerDto,
} from './layers.dto.js';
import { ResponseListDto } from '@/common/meta/meta.js';
import { Layer } from '@/entities/layers.entities.js';
import { rangeValidation } from '@/common/utils/rangeValidation.js';
import { normilizedSql } from '@/common/utils/regex.js';
import { Project } from '@/entities/projects.entities.js';

@Injectable()
export class LayersService {
  constructor(
    @InjectRepository(Layer)
    private readonly layerRepository: Repository<Layer>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private dataSource: DataSource,
  ) {}

  async getById(id: number): Promise<Layer> {
    const layer = await this.layerRepository.findOneBy({ id });

    if (!layer) throw new NotFoundException(`Layer with id ${id} not found`);

    return layer;
  }

  async getAll(query: LayerQueryDto): Promise<ResponseListDto<Layer>> {
    const { page, pageSize, sortBy, sortOrder, search, ...filters } = query;

    const queryBuilder = this.layerRepository
      .createQueryBuilder('qb')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy(`qb.${sortBy}`, sortOrder);

    if (filters.id?.length) queryBuilder.andWhere({ id: In(filters.id) });
    if (filters.name?.length) queryBuilder.andWhere({ name: In(filters.name) });
    if (filters.description?.length)
      queryBuilder.andWhere({ description: In(filters.description) });

    const [updatedAt, createdAt] = [
      rangeValidation(filters.updatedAtFrom, filters.updatedAtTo),
      rangeValidation(filters.createdAtFrom, filters.createdAtTo),
    ];

    if (updatedAt)
      queryBuilder.andWhere({
        updatedAt: rangeValidation(filters.updatedAtFrom, filters.updatedAtTo),
      });

    if (createdAt)
      queryBuilder.andWhere({
        createdAt: rangeValidation(filters.createdAtFrom, filters.createdAtTo),
      });

    const escaped = normilizedSql(search);
    if (filters.searchField && escaped) {
      queryBuilder.andWhere({
        [filters.searchField]: ILike(`%${escaped}%`),
      });
    } else if (search) {
      const fields = LAYER_SEARCH_WHITELIST.map((el) => `qb.${el}`).join(', ');
      queryBuilder.andWhere(`concat_ws(' ', ${fields}) ILIKE :search`, {
        search: `%${escaped}%`,
      });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        pageSize: pageSize,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async create(projectId: number, dto: CreateLayerDto[]): Promise<Layer[]> {
    const projectToAttach = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: { layers: true },
    });

    if (!projectToAttach)
      throw new NotFoundException(
        `Project with id ${projectId} not found. It's impossible to attach layer to non existing project`,
      );

    const allLayers = [...dto, ...projectToAttach.layers];
    const sortedByPosition = [...allLayers].sort(
      (a, b) => a.position - b.position,
    );
    const normalized = sortedByPosition.map((el, i) => ({
      ...el,
      position: i,
      projectId,
    }));

    // TODO: uncomment when logger will be added
    // const wasNormalized = sortedByPosition.some((el, i) => el.position !== i);
    // if (wasNormalized) {
    //   this.logger.warn(`Layer positions normalized`, {
    //     original: dto.map((el) => el.position),
    //   });
    // }

    return await this.layerRepository.save(
      this.layerRepository.create(normalized),
    );
  }

  async update(projectId: number, dto: UpdateLayerDto[]): Promise<Layer[]> {
    const projectToAttach = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: { layers: true },
    });

    if (!projectToAttach)
      throw new NotFoundException(
        `Project with id ${projectId} not found. It's impossible to attach layer to non existing project`,
      );

    const updated = this.applyLayerUpdates(projectToAttach.layers, dto);

    return await this.layerRepository.save(updated);
  }

  async batchAction(projectId: number, dto: BatchLayerDto): Promise<Layer[]> {
    const projectToAttach = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: { layers: true },
    });

    if (!projectToAttach)
      throw new NotFoundException(
        `Project with id ${projectId} not found. It's impossible to edit that is layer to non existing project`,
      );

    return await this.dataSource.transaction(async (manager) => {
      const created = await this.createByBatch(
        projectToAttach,
        dto.create,
        manager,
      );
      const updated = await this.updateByBatch(
        projectToAttach,
        dto.update,
        manager,
      );

      return manager.save([...updated, ...created]);
    });
  }

  async delete(id: number): Promise<Layer> {
    const layer = await this.layerRepository.findOneBy({ id });

    if (!layer) throw new NotFoundException(`Layer with id ${id} not found`);

    return await this.layerRepository.remove(layer);
  }

  async createByBatch(
    project: Project,
    dto: CreateLayerDto[],
    manager: EntityManager,
  ) {
    const allLayers = [...dto, ...project.layers];
    const sortedByPosition = allLayers.sort((a, b) => a.position - b.position);
    this.sortLayerPosition(allLayers);

    const normalized = sortedByPosition.map((el, i) => ({
      ...el,
      position: i,
      projectId: project.id,
    }));

    // TODO: uncomment when logger will be added
    // const wasNormalized = sortedByPosition.some((el, i) => el.position !== i);
    // if (wasNormalized) {
    //   this.logger.warn(`Layer positions normalized`, {
    //     original: dto.map((el) => el.position),
    //   });
    // }

    return manager.create(Layer, normalized);
  }

  async updateByBatch(
    project: Project,
    dto: UpdateLayerDto[],
    manager: EntityManager,
  ): Promise<Layer[]> {
    const layers = await manager.find(Layer, {
      where: { projectId: project.id },
    });

    return this.applyLayerUpdates(layers, dto);
  }

  private applyLayerUpdates(layers: Layer[], dto: UpdateLayerDto[]): Layer[] {
    const layersById = new Map(layers.map((el) => [el.id, el]));

    const missing = dto.filter(
      (el) => el.id === undefined || !layersById.has(el.id),
    );
    if (missing.length)
      throw new NotFoundException(
        `Layers with ids ${missing.map((el) => '#' + el.id).join(', ')} weren't found in this project`,
      );

    for (const { id, name, description, icon } of dto) {
      const fields = Object.fromEntries(
        Object.entries({ name, description, icon }).filter(
          ([, value]) => value !== undefined,
        ),
      );
      Object.assign(layersById.get(id!)!, fields);
    }

    const moved = dto
      .filter((el) => el.position !== undefined)
      .sort((a, b) => a.position! - b.position!);
    const movedIds = new Set(moved.map((el) => el.id));

    const ordered = [...layers]
      .sort((a, b) => a.position - b.position)
      .filter((el) => !movedIds.has(el.id));

    for (const el of moved)
      ordered.splice(Math.max(0, el.position!), 0, layersById.get(el.id!)!);

    ordered.forEach((el, i) => (el.position = i));

    return ordered;
  }

  sortLayerPosition = <T extends { position?: number }>(layers: T[]): T[] => {
    const sorted = [...layers].sort(
      (a, b) => (a?.position ?? 0) - (b?.position ?? 0),
    );
    return sorted.map((el, i) => ({
      ...el,
      position: i,
    }));
  };
}
