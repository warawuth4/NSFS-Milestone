import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Status, Priority } from '@prisma/client';

describe('TasksService (Unit - 2-Click Progress Updates & Templates)', () => {
  let service: TasksService;
  let prisma: any;

  const mockTask = {
    id: 't-1',
    title: 'Deploy backend to Render',
    role: 'DevOps Engineer',
    want: 'configure build & start commands in render.yaml',
    soThat: 'the API automatically deploys upon git push',
    status: Status.TODO,
    priority: Priority.HIGH,
    storyId: 's-1',
    sprintId: 'sp-1',
    acceptanceCriteria: [],
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn().mockResolvedValue(mockTask),
        findMany: jest.fn().mockResolvedValue([mockTask]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 't-1') return Promise.resolve(mockTask);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ ...mockTask, ...data }),
        ),
        delete: jest.fn().mockResolvedValue(mockTask),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task using template (As a ..., I want to ..., so that...)', async () => {
    const res = await service.create({
      title: 'Deploy backend to Render',
      role: 'DevOps Engineer',
      want: 'configure build & start commands in render.yaml',
      soThat: 'the API automatically deploys upon git push',
    });

    expect(res.id).toBe('t-1');
    expect(res.role).toBe('DevOps Engineer');
    expect(res.want).toBe('configure build & start commands in render.yaml');
    expect(res.soThat).toBe('the API automatically deploys upon git push');
  });

  it('should update task status directly for 2-click progress change (Requirements 7 & 8)', async () => {
    const updated = await service.updateStatus('t-1', Status.DONE);
    expect(updated.status).toBe(Status.DONE);
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 't-1' },
      data: { status: Status.DONE },
      include: { story: true, sprint: true },
    });
  });

  it('should throw NotFoundException when updating non-existent task', async () => {
    await expect(service.updateStatus('unknown', Status.DONE)).rejects.toThrow(
      NotFoundException,
    );
  });
});
