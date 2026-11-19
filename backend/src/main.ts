import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Always allow all Vercel deployments and local development
      if (
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      // Allow origins configured via FRONTEND_URL (supports comma-separated list)
      const customAllowed = (process.env.FRONTEND_URL || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (customAllowed.length === 0 || customAllowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
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
