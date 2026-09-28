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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service.js';
import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from './projects.dto.js';
import {
  CreateProjectsApiDocs,
  DeleteProjectsApiDocs,
  GetAllProjectsApiDocs,
  GetByIdProjectsApiDocs,
  UpdateProjectsApiDocs,
} from './docs/index.js';

@ApiTags('Projects')
@ApiBearerAuth('Access-token')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @GetAllProjectsApiDocs()
  @Get('list')
  getAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.getAll(query);
  }

  @GetByIdProjectsApiDocs()
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getById(id);
  }

  @CreateProjectsApiDocs()
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @UpdateProjectsApiDocs()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return await this.projectsService.update(id, dto);
  }

  @DeleteProjectsApiDocs()
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.projectsService.delete(id);
  }
}
