import { Test, TestingModule } from '@nestjs/testing';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { MilestoneStatus } from '@prisma/client';

describe('MilestonesController (Unit)', () => {
  let controller: MilestonesController;
  let service: MilestonesService;

  const mockMilestone = {
    id: 'm-1',
    title: 'Milestone 1',
    status: MilestoneStatus.IN_PROGRESS,
    progress: { totalTasks: 1, doneTasks: 1, percentage: 100 },
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue(mockMilestone),
      findAll: jest.fn().mockResolvedValue([mockMilestone]),
      findOne: jest.fn().mockResolvedValue(mockMilestone),
      update: jest.fn().mockResolvedValue({ ...mockMilestone, title: 'Updated' }),
      remove: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilestonesController],
      providers: [{ provide: MilestonesService, useValue: mockService }],
    }).compile();

    controller = module.get<MilestonesController>(MilestonesController);
    service = module.get<MilestonesService>(MilestonesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create milestone', async () => {
    const dto = { title: 'Milestone 1' };
    const res = await controller.create(dto);
    expect(res).toEqual(mockMilestone);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all milestones', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([mockMilestone]);
  });

  it('should return single milestone', async () => {
    const res = await controller.findOne('m-1');
    expect(res).toEqual(mockMilestone);
  });

  it('should update milestone', async () => {
    const res = await controller.update('m-1', { title: 'Updated' });
    expect(res.title).toBe('Updated');
  });

  it('should delete milestone', async () => {
    const res = await controller.remove('m-1');
    expect(res.success).toBe(true);
  });
});
