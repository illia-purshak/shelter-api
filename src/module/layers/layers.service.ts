import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLayerDto, LayerQueryDto, UpdateLayerDto } from './layers.dto.js';
import { ResponseListDto } from '@/common/meta/meta.js';
import { Layer } from '@/entities/layers.entities.js';

@Injectable()
export class LayersService {
  constructor(
    @InjectRepository(Layer)
    private readonly layerRepository: Repository<Layer>,
  ) {}

  async getById(id: number): Promise<Layer> {
    const layer = await this.layerRepository.findOneBy({ id });

    if (!layer) throw new NotFoundException(`Layer with id ${id} not found`);

    return layer;
  }

  async getAll(query: LayerQueryDto): Promise<ResponseListDto<Layer>> {
    const [items, total] = await this.layerRepository.findAndCount({
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

  async create(dto: CreateLayerDto): Promise<Layer> {
    return await this.layerRepository.save(this.layerRepository.create(dto));
  }

  async update(id: number, dto: UpdateLayerDto): Promise<Layer> {
    const layer = await this.layerRepository.findOneBy({ id });

    if (!layer) throw new NotFoundException(`Layer with id ${id} not found`);

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
