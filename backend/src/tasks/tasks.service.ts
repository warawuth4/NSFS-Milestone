import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Status } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    this.logger.log(`Creating task: ${dto.title}`);
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        role: dto.role,
        want: dto.want,
        soThat: dto.soThat,
        description: dto.description,
        status: dto.status || Status.TODO,
        priority: dto.priority,
        storyId: dto.storyId && dto.storyId.trim() !== '' ? dto.storyId : null,
        sprintId: dto.sprintId && dto.sprintId.trim() !== '' ? dto.sprintId : null,
      },
      include: {
        story: {
          include: {
            epic: {
              include: {
                milestone: true,
              },
            },
          },
        },
        sprint: true,
        acceptanceCriteria: true,
      },
    });

    this.logger.log(`Task created successfully: ID ${task.id}`);
    return task;
  }

  async findAll(storyId?: string, sprintId?: string, status?: Status) {
    this.logger.log(
      `Finding tasks (storyId: ${storyId ?? 'all'}, sprintId: ${sprintId ?? 'all'}, status: ${status ?? 'all'})`,
    );
    return this.prisma.task.findMany({
      where: {
        ...(storyId && { storyId }),
        ...(sprintId && { sprintId }),
        ...(status && { status }),
      },
      include: {
        story: {
          select: { id: true, title: true, epicId: true },
        },
        sprint: {
          select: { id: true, name: true, status: true },
        },
        acceptanceCriteria: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    this.logger.log(`Fetching task ID ${id}`);
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        story: {
          include: {
            epic: {
              include: {
                milestone: true,
              },
            },
          },
        },
        sprint: true,
        acceptanceCriteria: true,
      },
    });

    if (!task) {
      this.logger.warn(`Task not found: ID ${id}`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    this.logger.log(`Updating task ID ${id}`);
    await this.findOne(id);

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.want !== undefined && { want: dto.want }),
        ...(dto.soThat !== undefined && { soThat: dto.soThat }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.storyId !== undefined && { storyId: dto.storyId }),
        ...(dto.sprintId !== undefined && { sprintId: dto.sprintId }),
      },
      include: {
        story: true,
        sprint: true,
        acceptanceCriteria: true,
      },
    });

    this.logger.log(`Task updated successfully: ID ${id}`);
    return updated;
  }

  async updateStatus(id: string, status: Status) {
    this.logger.log(`Quick-updating task ID ${id} progress status to: ${status}`);
    await this.findOne(id);

    const updated = await this.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        story: true,
        sprint: true,
      },
    });

    this.logger.log(`Task ${id} status successfully transitioned to ${status}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting task ID ${id}`);
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    this.logger.log(`Task deleted successfully: ID ${id}`);
    return { success: true, message: `Task ${id} deleted` };
  }
}
