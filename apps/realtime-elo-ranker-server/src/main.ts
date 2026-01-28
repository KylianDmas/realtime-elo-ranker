import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  // 1. Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 2. Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Realtime Elo Ranker API')
    .setDescription("Documentation de l'API de classement Elo")
    .setVersion('1.0')
    .addTag('ranking')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();
  await app.listen(8080);
  console.log(`Application is running on: http://localhost:8080`);
  console.log(`Swagger Docs: http://localhost:8080/api/docs`);
}
bootstrap();
