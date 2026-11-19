import { Test, TestingModule } from '@nestjs/testing';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';
import { SprintStatus } from '@prisma/client';

describe('SprintsController (Unit)', () => {
  let controller: SprintsController;
  let service: SprintsService;

  const mockSprint = {
    id: 'sp-1',
    name: 'Sprint 1',
    status: SprintStatus.PLANNED,
    progress: { totalTasks: 0, doneTasks: 0, percentage: 0 },
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue(mockSprint),
      findAll: jest.fn().mockResolvedValue([mockSprint]),
      findOne: jest.fn().mockResolvedValue(mockSprint),
      update: jest.fn().mockResolvedValue({ ...mockSprint, name: 'Sprint 1 Updated' }),
      remove: jest.fn().mockResolvedValue({ success: true }),
      assignTask: jest.fn().mockResolvedValue({ id: 't-1', sprintId: 'sp-1' }),
      unassignTask: jest.fn().mockResolvedValue({ id: 't-1', sprintId: null }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SprintsController],
      providers: [{ provide: SprintsService, useValue: mockService }],
    }).compile();

    controller = module.get<SprintsController>(SprintsController);
    service = module.get<SprintsService>(SprintsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create sprint', async () => {
    const res = await controller.create({ name: 'Sprint 1' });
    expect(res).toEqual(mockSprint);
    expect(service.create).toHaveBeenCalled();
  });

  it('should list sprints', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([mockSprint]);
  });

  it('should assign task to sprint', async () => {
    const res = await controller.assignTask('sp-1', { taskId: 't-1' });
    expect(res.sprintId).toBe('sp-1');
  });

  it('should unassign task from sprint', async () => {
    const res = await controller.unassignTask('sp-1', 't-1');
    expect(res.sprintId).toBeNull();
  });
});
