import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MilestonesModule } from './milestones.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MilestoneStatus } from '@prisma/client';

describe('MilestonesModule (Integration)', () => {
  let app: INestApplication;
  let prisma: any;

  const mockMilestone = {
    id: 'm-int-1',
    title: 'Integration Milestone',
    description: 'Testing module integration',
    targetDate: new Date('2026-12-31'),
    status: MilestoneStatus.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date(),
    sprints: [],
    epics: [],
  };

  beforeAll(async () => {
    prisma = {
      milestone: {
        create: jest.fn().mockResolvedValue(mockMilestone),
        findMany: jest.fn().mockResolvedValue([mockMilestone]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'm-int-1') return Promise.resolve(mockMilestone);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockResolvedValue({ ...mockMilestone, title: 'Updated Integration Milestone' }),
        delete: jest.fn().mockResolvedValue(mockMilestone),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, MilestonesModule],
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

  it('POST /milestones creates milestone with validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/milestones')
      .send({ title: 'Integration Milestone' })
      .expect(201);

    expect(res.body.id).toBe('m-int-1');
  });

  it('POST /milestones fails when title is empty', async () => {
    await request(app.getHttpServer())
      .post('/milestones')
      .send({})
      .expect(400);
  });

  it('GET /milestones returns all milestones with progress object', async () => {
    const res = await request(app.getHttpServer())
      .get('/milestones')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].progress).toBeDefined();
  });

  it('GET /milestones/:id returns milestone details', async () => {
    const res = await request(app.getHttpServer())
      .get('/milestones/m-int-1')
      .expect(200);

    expect(res.body.id).toBe('m-int-1');
  });

  it('GET /milestones/:id returns 404 for unknown id', async () => {
    await request(app.getHttpServer())
      .get('/milestones/not-found')
      .expect(404);
  });
});
