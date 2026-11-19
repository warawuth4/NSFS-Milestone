import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TasksModule } from './tasks.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { Status, Priority } from '@prisma/client';

describe('TasksModule (Integration - 2-Click Progress Updates & Templates)', () => {
  let app: INestApplication;
  let prisma: any;

  const mockTask = {
    id: 't-int-1',
    title: 'Integration Task',
    role: 'QA engineer',
    want: 'run automated regression suites',
    soThat: 'no bugs escape into production milestone',
    status: Status.TODO,
    priority: Priority.HIGH,
    storyId: null,
    sprintId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    story: null,
    sprint: null,
    acceptanceCriteria: [],
  };

  beforeAll(async () => {
    prisma = {
      task: {
        create: jest.fn().mockResolvedValue(mockTask),
        findMany: jest.fn().mockResolvedValue([mockTask]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 't-int-1') return Promise.resolve(mockTask);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ where, data }) => {
          return Promise.resolve({ ...mockTask, ...data });
        }),
        delete: jest.fn().mockResolvedValue(mockTask),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, TasksModule],
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

  it('POST /tasks creates task with template As a... I want to... so that...', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Integration Task',
        role: 'QA engineer',
        want: 'run automated regression suites',
        soThat: 'no bugs escape into production milestone',
      })
      .expect(201);

    expect(res.body.id).toBe('t-int-1');
    expect(res.body.role).toBe('QA engineer');
  });

  it('PATCH /tasks/:id/status updates progress in 2 clicks', async () => {
    const res = await request(app.getHttpServer())
      .patch('/tasks/t-int-1/status')
      .send({ status: Status.DONE })
      .expect(200);

    expect(res.body.status).toBe(Status.DONE);
  });

  it('PATCH /tasks/:id/status rejects invalid status enum', async () => {
    await request(app.getHttpServer())
      .patch('/tasks/t-int-1/status')
      .send({ status: 'INVALID_STATUS' })
      .expect(400);
  });
});
