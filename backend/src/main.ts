import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'] : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('NSFS Milestone & Agile Tracking API')
    .setDescription(
      'REST API for tracking project milestones, managing sprints, and creating epics, user stories, tasks, and acceptance criteria.',
    )
    .setVersion('1.0')
    .addTag('Milestones', 'Project milestone lifecycle and progress')
    .addTag('Sprints', 'Sprint planning and task allocation')
    .addTag('Epics', 'Epics with user story templates')
    .addTag('Stories', 'User stories with role, goal, and benefit templates')
    .addTag('Tasks', 'Actionable tasks with quick 2-click status transitions')
    .addTag('Acceptance Criteria', 'Given-When-Then criteria validation')
    .addTag('Health', 'System health checks for Render deployment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NSFS Milestone API Docs',
  });

  const port = process.env.PORT || 4000;
  // Listen on 0.0.0.0 for Render compatibility
  await app.listen(port, '0.0.0.0');

  logger.log(`Server is running on port ${port} (0.0.0.0)`);
  logger.log(`Swagger documentation available at /api/docs`);
}

bootstrap();
