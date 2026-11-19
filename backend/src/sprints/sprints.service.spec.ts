import { Test, TestingModule } from '@nestjs/testing';
import { SprintsService } from './sprints.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { SprintStatus } from '@prisma/client';

describe('SprintsService (Unit)', () => {
  let service: SprintsService;
  let prisma: any;

  const mockSprint = {
    id: 'sp-1',
    name: 'Sprint 1',
    goal: 'Ship MVP',
    status: SprintStatus.ACTIVE,
    milestoneId: 'm-1',
    tasks: [
      { id: 't-1', title: 'Task 1', status: 'DONE' },
      { id: 't-2', title: 'Task 2', status: 'TODO' },
    ],
  };

  beforeEach(async () => {
    prisma = {
      sprint: {
        create: jest.fn().mockResolvedValue(mockSprint),
        findMany: jest.fn().mockResolvedValue([mockSprint]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'sp-1') return Promise.resolve(mockSprint);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ ...mockSprint, ...data }),
        ),
        delete: jest.fn().mockResolvedValue(mockSprint),
      },
      task: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 't-1') return Promise.resolve({ id: 't-1', title: 'Task 1' });
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 't-1', title: 'Task 1', ...data }),
        ),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SprintsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SprintsService>(SprintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a sprint', async () => {
    const res = await service.create({ name: 'Sprint 1', goal: 'Ship MVP' });
    expect(res.id).toBe('sp-1');
  });

  it('should list sprints with metrics', async () => {
    const res = await service.findAll();
    expect(res).toHaveLength(1);
    expect(res[0].progress.totalTasks).toBe(2);
    expect(res[0].progress.doneTasks).toBe(1);
    expect(res[0].progress.percentage).toBe(50);
  });

  it('should assign a task to sprint', async () => {
    const res = await service.assignTask('sp-1', 't-1');
    expect(res.sprintId).toBe('sp-1');
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 't-1' },
      data: { sprintId: 'sp-1' },
      include: { sprint: true, story: true },
    });
  });

  it('should throw error when assigning to non-existent sprint', async () => {
    await expect(service.assignTask('sp-999', 't-1')).rejects.toThrow(NotFoundException);
  });

  it('should unassign a task from sprint', async () => {
    const res = await service.unassignTask('t-1');
    expect(res.sprintId).toBeNull();
  });
});
