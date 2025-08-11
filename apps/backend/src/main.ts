/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  Logger.log(
    `🌐 CORS Origins: ${process.env.CORS_ORIGINS || 'localhost:4200,4201,3000'}`
  );
  Logger.log(
    `🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`
  );
}

bootstrap();
