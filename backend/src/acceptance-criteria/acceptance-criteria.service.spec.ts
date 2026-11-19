import { Test, TestingModule } from '@nestjs/testing';
import { AcceptanceCriteriaService } from './acceptance-criteria.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AcceptanceCriteriaService (Unit - Given-When-Then Template)', () => {
  let service: AcceptanceCriteriaService;
  let prisma: any;

  const mockCriterion = {
    id: 'ac-1',
    given: 'a user clicks the task status pill',
    when: 'the user selects "DONE"',
    then: 'the milestone progress recalculates immediately within 2 clicks',
    isMet: false,
    taskId: 't-1',
  };

  beforeEach(async () => {
    prisma = {
      acceptanceCriterion: {
        create: jest.fn().mockResolvedValue(mockCriterion),
        findMany: jest.fn().mockResolvedValue([mockCriterion]),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'ac-1') return Promise.resolve(mockCriterion);
          return Promise.resolve(null);
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ ...mockCriterion, ...data }),
        ),
        delete: jest.fn().mockResolvedValue(mockCriterion),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcceptanceCriteriaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AcceptanceCriteriaService>(AcceptanceCriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create acceptance criterion using Given-When-Then template (Requirement 2)', async () => {
    const res = await service.create({
      given: 'a user clicks the task status pill',
      when: 'the user selects "DONE"',
      then: 'the milestone progress recalculates immediately within 2 clicks',
      taskId: 't-1',
    });

    expect(res.id).toBe('ac-1');
    expect(res.given).toBe('a user clicks the task status pill');
    expect(res.when).toBe('the user selects "DONE"');
    expect(res.then).toBe('the milestone progress recalculates immediately within 2 clicks');
  });

  it('should toggle isMet state', async () => {
    const res = await service.toggle('ac-1');
    expect(res.isMet).toBe(true);
  });
});
