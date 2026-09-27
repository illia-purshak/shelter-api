import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import {
  CreateLayerDto,
  LAYER_SEARCH_WHITELIST,
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

  async update(
    projectId: number,
    id: number,
    dto: UpdateLayerDto,
  ): Promise<Layer> {
    const projectToAttach = await this.projectRepository.findOneBy({
      id: projectId,
    });

    if (!projectToAttach)
      throw new NotFoundException(
        `Project with id ${projectId} not found. It's impossible to edit that is layer to non existing project`,
      );

    const layer = await this.layerRepository.findOneBy({ id });

    if (!layer) throw new NotFoundException(`Layer with id ${id} not found`);

    if (projectToAttach.id !== layer?.projectId)
      throw new BadRequestException(
        `Layer with id ${id} does not exist in project with id ${projectId}`,
      );

    return await this.layerRepository.save(
      this.layerRepository.merge(layer, dto),
    );
  }

  async delete(id: number): Promise<Layer> {
    const layer = await this.layerRepository.findOneBy({ id });

    if (!layer) throw new NotFoundException(`Layer with id ${id} not found`);

    return await this.layerRepository.remove(layer);
  }
}
