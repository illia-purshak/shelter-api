import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LayersService } from './layers.service.js';
import { CreateLayerDto, LayerQueryDto, UpdateLayerDto } from './layers.dto.js';
import {
  CreateLayersApiDocs,
  DeleteLayersApiDocs,
  GetAllLayersApiDocs,
  GetByIdLayersApiDocs,
  UpdateLayersApiDocs,
} from './docs/index.js';

@ApiTags('Layers')
@ApiBearerAuth('Access-token')
@Controller('layers')
export class LayersController {
  constructor(private readonly layersService: LayersService) {}

  @GetAllLayersApiDocs()
  @Get('list')
  getAll(@Query() query: LayerQueryDto) {
    return this.layersService.getAll(query);
  }

  @GetByIdLayersApiDocs()
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.layersService.getById(id);
  }

  // @Get('list/:projectId')
  // getAllInProject(
  //   @Param('projectId', ParseIntPipe) projectId: number,
  //   @Query() query: LayerQueryDto,
  // ) {
  //   return this.layersService.getAllInProject(projectId, query);
  // }

  @CreateLayersApiDocs()
  @Post(':projectId')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body(
      new ParseArrayPipe({
        items: CreateLayerDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dto: CreateLayerDto[],
  ) {
    return this.layersService.create(projectId, dto);
  }

  @UpdateLayersApiDocs()
  @Patch(':projectId/:id')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLayerDto,
  ) {
    return await this.layersService.update(projectId, id, dto);
  }

  @DeleteLayersApiDocs()
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.layersService.delete(id);
  }
}
