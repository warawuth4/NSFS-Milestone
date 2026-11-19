import { Test, TestingModule } from '@nestjs/testing';
import { MilestonesService } from './milestones.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { MilestoneStatus } from '@prisma/client';

describe('MilestonesService (Unit)', () => {
  let service: MilestonesService;
  let prisma: any;

  const mockMilestone = {
    id: 'm-1',
    title: 'Milestone 1',
    description: 'Initial release',
    targetDate: new Date('2026-06-30'),
    status: MilestoneStatus.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date(),
    sprints: [
      {
        id: 's-1',
        tasks: [
          { id: 't-1', status: 'DONE', priority: 'HIGH', title: 'Task 1' },
          { id: 't-2', status: 'IN_PROGRESS', priority: 'MEDIUM', title: 'Task 2' },
        ],
      },
    ],
    epics: [],
  };

  beforeEach(async () => {
    prisma = {
      milestone: {
        create: jest.fn().mockResolvedValue(mockMilestone),
        findMany: jest.fn().mockResolvedValue([mockMilestone]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'm-1') return Promise.resolve(mockMilestone);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ ...mockMilestone, ...data }),
        ),
        delete: jest.fn().mockResolvedValue(mockMilestone),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilestonesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MilestonesService>(MilestonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a milestone', async () => {
    const result = await service.create({
      title: 'Milestone 1',
      description: 'Initial release',
    });
    expect(result.id).toBe('m-1');
    expect(prisma.milestone.create).toHaveBeenCalled();
  });

  it('should list all milestones with calculated progress', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].progress).toBeDefined();
    expect(result[0].progress.totalTasks).toBe(2);
    expect(result[0].progress.doneTasks).toBe(1);
    expect(result[0].progress.inProgressTasks).toBe(1);
    expect(result[0].progress.percentage).toBe(50);
  });

  it('should get milestone by id', async () => {
    const result = await service.findOne('m-1');
    expect(result.id).toBe('m-1');
    expect(result.progress.percentage).toBe(50);
  });

  it('should throw NotFoundException if milestone does not exist', async () => {
    await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
  });

  it('should update milestone', async () => {
    const result = await service.update('m-1', { title: 'Updated Milestone' });
    expect(result.title).toBe('Updated Milestone');
  });

  it('should delete milestone', async () => {
    const result = await service.remove('m-1');
    expect(result.success).toBe(true);
    expect(prisma.milestone.delete).toHaveBeenCalledWith({ where: { id: 'm-1' } });
  });
});
