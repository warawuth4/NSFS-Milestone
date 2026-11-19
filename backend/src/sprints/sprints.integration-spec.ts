import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { SprintsModule } from './sprints.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { SprintStatus } from '@prisma/client';

describe('SprintsModule (Integration)', () => {
  let app: INestApplication;
  let prisma: any;

  const mockSprint = {
    id: 'sp-int-1',
    name: 'Integration Sprint',
    goal: 'Testing Sprint Endpoints',
    status: SprintStatus.PLANNED,
    milestoneId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  };

  beforeAll(async () => {
    prisma = {
      sprint: {
        create: jest.fn().mockResolvedValue(mockSprint),
        findMany: jest.fn().mockResolvedValue([mockSprint]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'sp-int-1') return Promise.resolve(mockSprint);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockResolvedValue({ ...mockSprint, name: 'Updated Sprint' }),
        delete: jest.fn().mockResolvedValue(mockSprint),
      },
      task: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 't-int-1') return Promise.resolve({ id: 't-int-1', title: 'Task' });
          return Promise.resolve(null);
        }),
        update: jest.fn().mockResolvedValue({ id: 't-int-1', sprintId: 'sp-int-1' }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, SprintsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /sprints creates a sprint', async () => {
    const res = await request(app.getHttpServer())
      .post('/sprints')
      .send({ name: 'Integration Sprint' })
      .expect(201);

    expect(res.body.id).toBe('sp-int-1');
  });

  it('GET /sprints returns list of sprints', async () => {
    const res = await request(app.getHttpServer())
      .get('/sprints')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].progress).toBeDefined();
  });

  it('POST /sprints/:id/tasks assigns a task to sprint', async () => {
    const res = await request(app.getHttpServer())
      .post('/sprints/sp-int-1/tasks')
      .send({ taskId: 't-int-1' })
      .expect(201);

    expect(res.body.sprintId).toBe('sp-int-1');
  });
});
