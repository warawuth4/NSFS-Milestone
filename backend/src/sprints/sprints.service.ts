import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintStatus } from '@prisma/client';

@Injectable()
export class SprintsService {
  private readonly logger = new Logger(SprintsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSprintDto) {
    this.logger.log(`Creating sprint: ${dto.name}`);
    const sprint = await this.prisma.sprint.create({
      data: {
        name: dto.name,
        goal: dto.goal,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status || SprintStatus.PLANNED,
        milestoneId: dto.milestoneId,
      },
      include: {
        milestone: true,
        tasks: true,
      },
    });

    this.logger.log(`Sprint created successfully: ID ${sprint.id}`);
    return sprint;
  }

  async findAll(milestoneId?: string, status?: SprintStatus) {
    this.logger.log(`Finding sprints (milestone: ${milestoneId ?? 'all'}, status: ${status ?? 'all'})`);
    const sprints = await this.prisma.sprint.findMany({
      where: {
        ...(milestoneId && { milestoneId }),
        ...(status && { status }),
      },
      include: {
        milestone: {
          select: { id: true, title: true, status: true },
        },
        tasks: {
          include: {
            story: {
              select: { id: true, title: true, epicId: true },
            },
            acceptanceCriteria: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sprints.map((sprint) => this.calculateSprintMetrics(sprint));
  }

  async findOne(id: string) {
    this.logger.log(`Fetching sprint detail for ID ${id}`);
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        milestone: true,
        tasks: {
          include: {
            story: {
              include: {
                epic: true,
              },
            },
            acceptanceCriteria: true,
          },
        },
      },
    });

    if (!sprint) {
      this.logger.warn(`Sprint not found: ID ${id}`);
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }

    return this.calculateSprintMetrics(sprint);
  }

  async update(id: string, dto: UpdateSprintDto) {
    this.logger.log(`Updating sprint ID ${id}`);
    await this.findOne(id);

    const updated = await this.prisma.sprint.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.goal !== undefined && { goal: dto.goal }),
        ...(dto.startDate !== undefined && {
          startDate: dto.startDate ? new Date(dto.startDate) : null,
        }),
        ...(dto.endDate !== undefined && {
          endDate: dto.endDate ? new Date(dto.endDate) : null,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.milestoneId !== undefined && { milestoneId: dto.milestoneId }),
      },
      include: {
        milestone: true,
        tasks: true,
      },
    });

    this.logger.log(`Sprint updated successfully: ID ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting sprint ID ${id}`);
    await this.findOne(id);
    await this.prisma.sprint.delete({ where: { id } });
    this.logger.log(`Sprint deleted successfully: ID ${id}`);
    return { success: true, message: `Sprint ${id} deleted` };
  }

  async assignTask(sprintId: string, taskId: string) {
    this.logger.log(`Assigning task ${taskId} to sprint ${sprintId}`);
    await this.findOne(sprintId);

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { sprintId },
      include: {
        sprint: true,
        story: true,
      },
    });

    this.logger.log(`Task ${taskId} assigned to sprint ${sprintId}`);
    return updatedTask;
  }

  async unassignTask(taskId: string) {
    this.logger.log(`Removing task ${taskId} from its sprint`);
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: { sprintId: null },
    });

    return updated;
  }

  private calculateSprintMetrics(sprint: any) {
    const tasks = sprint.tasks || [];
    const total = tasks.length;
    const done = tasks.filter((t: any) => t.status === 'DONE').length;
    const inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
    const inReview = tasks.filter((t: any) => t.status === 'IN_REVIEW').length;
    const todo = tasks.filter((t: any) => t.status === 'TODO').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      ...sprint,
      progress: {
        totalTasks: total,
        doneTasks: done,
        inProgressTasks: inProgress,
        inReviewTasks: inReview,
        todoTasks: todo,
        percentage,
      },
    };
  }
}
