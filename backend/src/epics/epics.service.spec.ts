import { Test, TestingModule } from '@nestjs/testing';
import { EpicsService } from './epics.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Status, Priority } from '@prisma/client';

describe('EpicsService (Unit)', () => {
  let service: EpicsService;
  let prisma: any;

  const mockEpic = {
    id: 'e-1',
    title: 'Authentication Module',
    role: 'product manager',
    want: 'implement secure sign-in',
    soThat: 'users can securely manage milestones',
    status: Status.TODO,
    priority: Priority.HIGH,
    milestoneId: 'm-1',
    stories: [],
    acceptanceCriteria: [],
  };

  beforeEach(async () => {
    prisma = {
      epic: {
        create: jest.fn().mockResolvedValue(mockEpic),
        findMany: jest.fn().mockResolvedValue([mockEpic]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'e-1') return Promise.resolve(mockEpic);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ ...mockEpic, ...data }),
        ),
        delete: jest.fn().mockResolvedValue(mockEpic),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpicsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EpicsService>(EpicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an epic with user story template fields', async () => {
    const res = await service.create({
      title: 'Authentication Module',
      role: 'product manager',
      want: 'implement secure sign-in',
      soThat: 'users can securely manage milestones',
    });
    expect(res.id).toBe('e-1');
    expect(res.role).toBe('product manager');
    expect(prisma.epic.create).toHaveBeenCalled();
  });

  it('should list epics', async () => {
    const res = await service.findAll();
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe('Authentication Module');
  });

  it('should throw NotFoundException when epic does not exist', async () => {
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });
});
