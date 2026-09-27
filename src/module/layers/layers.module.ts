import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LayersService } from './layers.service.js';
import { LayersController } from './layers.controller.js';
import { Layer } from '@/entities/layers.entities.js';
import { Project } from '@/entities/projects.entities.js';

@Module({
  imports: [TypeOrmModule.forFeature([Layer, Project])],
  controllers: [LayersController],
  providers: [LayersService],
})
export class LayersModule {}
