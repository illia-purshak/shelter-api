import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, In, Repository } from 'typeorm';
import {
  CreateProjectDto,
  PROJECT_SEARCH_WHITELIST,
  ProjectQueryDto,
  UpdateProjectDto,
} from './projects.dto.js';
import { Project } from '@/entities/projects.entities.js';
import { ResponseListDto } from '@/common/meta/meta.js';
import { rangeValidation } from '@/common/utils/rangeValidation.js';
import { normilizedSql } from '@/common/utils/regex.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project)
      throw new NotFoundException(`Project with id ${id} not found`);

    return project;
  }

  async getAll(query: ProjectQueryDto): Promise<ResponseListDto<Project>> {
    const { page, pageSize, sortBy, sortOrder, search, ...filters } = query;

    const queryBuilder = this.projectRepository
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
      const fields = PROJECT_SEARCH_WHITELIST.map((el) => `qb.${el}`).join(
        ', ',
      );
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

  async create(dto: CreateProjectDto): Promise<Project> {
    return await this.projectRepository.save(
      this.projectRepository.create(dto),
    );
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project)
      throw new NotFoundException(`Project with id ${id} not found`);

    return await this.projectRepository.save(
      this.projectRepository.merge(project, dto),
    );
  }

  async delete(id: number): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project)
      throw new NotFoundException(`Project with id ${id} not found`);

    return await this.projectRepository.remove(project);
  }
}
