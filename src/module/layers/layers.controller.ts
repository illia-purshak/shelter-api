import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LayersService } from './layers.service.js';
import { CreateLayerDto, LayerQueryDto, UpdateLayerDto } from './layers.dto.js';

@Controller('layers')
export class LayersController {
  constructor(private readonly layersService: LayersService) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.layersService.getById(id);
  }

  @Get()
  getAll(@Query() query: LayerQueryDto) {
    return this.layersService.getAll(query);
  }

  @Post()
  create(@Body() dto: CreateLayerDto) {
    return this.layersService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLayerDto,
  ) {
    return await this.layersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.layersService.delete(id);
  }
}
