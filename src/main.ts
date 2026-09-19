import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
