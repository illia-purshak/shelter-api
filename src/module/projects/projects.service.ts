import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from './projects.dto.js';
import { Project } from '@/entities/projects.entities.js';
import { ResponseListDto } from '@/common/meta/meta.js';

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
    const [items, total] = await this.projectRepository.findAndCount({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      order: {
        [query.sortBy]: query.sortOrder,
      },
    });

    return {
      items,
      meta: {
        pageSize: query.pageSize,
        currentPage: query.page,
        totalPages: Math.ceil(total / query.pageSize),
        hasNextPage: query.page * query.pageSize < total,
        hasPrevPage: query.page > 1,
      },
    };
  }

  create(dto: CreateProjectDto): Project {
    return this.projectRepository.create(dto);
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
