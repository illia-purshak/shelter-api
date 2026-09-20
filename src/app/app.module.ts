import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProjectsModule } from '@/module/projects/projects.module.js';
import { DatabaseModule } from '@/database/database.module.js';
import { LayersModule } from '@/module/layers/layers.module.js';

@Module({
  imports: [ProjectsModule, LayersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
