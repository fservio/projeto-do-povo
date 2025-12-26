import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.NEXT_PUBLIC_PORTAL_URL,
      process.env.NEXT_PUBLIC_DIARIO_URL,
    ].filter(Boolean),
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('CMS Portal de Notícias API')
    .setDescription('API RESTful para gerenciamento de conteúdo')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('articles', 'Artigos e conteúdo')
    .addTag('categories', 'Categorias')
    .addTag('tags', 'Tags')
    .addTag('media', 'Gestão de mídia')
    .addTag('home', 'Home page builder')
    .addTag('comments', 'Comentários')
    .addTag('ads', 'Publicidade')
    .addTag('users', 'Usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);

  console.log(`🚀 API rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação: http://localhost:${port}/api/docs`);
}

bootstrap();
