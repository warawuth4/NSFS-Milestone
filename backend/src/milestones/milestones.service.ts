import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  private readonly logger = new Logger(MilestonesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly redis?: RedisService,
  ) {}

  async create(dto: CreateMilestoneDto) {
    this.logger.log(`Creating milestone: ${dto.title}`);
    const milestone = await this.prisma.milestone.create({
      data: {
        title: dto.title,
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        status: dto.status,
      },
      include: {
        sprints: true,
        epics: true,
      },
    });

    if (this.redis) {
      await this.redis.delByPattern('milestones:*');
    }

    this.logger.log(`Milestone created successfully: ID ${milestone.id}`);
    return milestone;
  }

  async findAll() {
    const cacheKey = 'milestones:all';
    if (this.redis) {
      const cached = await this.redis.get<any[]>(cacheKey);
      if (cached) {
        this.logger.log('Returning milestones from Redis cache');
        return cached;
      }
    }

    this.logger.log('Fetching all milestones with sprints and epics progress from database');
    const milestones = await this.prisma.milestone.findMany({
      include: {
        sprints: {
          include: {
            tasks: {
              select: { id: true, status: true, priority: true, title: true },
            },
          },
        },
        epics: {
          include: {
            stories: {
              include: {
                tasks: {
                  select: { id: true, status: true, priority: true, title: true, sprintId: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = milestones.map((milestone) => this.calculateMilestoneProgress(milestone));

    if (this.redis) {
      await this.redis.set(cacheKey, result, 60);
    }

    return result;
  }

  async findOne(id: string) {
    const cacheKey = `milestones:${id}`;
    if (this.redis) {
      const cached = await this.redis.get<any>(cacheKey);
      if (cached) {
        this.logger.log(`Returning milestone ${id} from Redis cache`);
        return cached;
      }
    }

    this.logger.log(`Fetching milestone detail for ID ${id}`);
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: {
        sprints: {
          include: {
            tasks: {
              include: {
                acceptanceCriteria: true,
              },
            },
          },
        },
        epics: {
          include: {
            stories: {
              include: {
                tasks: {
                  include: {
                    sprint: true,
                    acceptanceCriteria: true,
                  },
                },
                acceptanceCriteria: true,
              },
            },
            acceptanceCriteria: true,
          },
        },
      },
    });

    if (!milestone) {
      this.logger.warn(`Milestone not found: ID ${id}`);
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    const result = this.calculateMilestoneProgress(milestone);

    if (this.redis) {
      await this.redis.set(cacheKey, result, 60);
    }

    return result;
  }

  async update(id: string, dto: UpdateMilestoneDto) {
    this.logger.log(`Updating milestone ID ${id}`);
    await this.findOne(id);

    const updated = await this.prisma.milestone.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.targetDate !== undefined && {
          targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
      include: {
        sprints: true,
        epics: true,
      },
    });

    if (this.redis) {
      await this.redis.delByPattern('milestones:*');
    }

    this.logger.log(`Milestone updated successfully: ID ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting milestone ID ${id}`);
    await this.findOne(id);
    await this.prisma.milestone.delete({ where: { id } });

    if (this.redis) {
      await this.redis.delByPattern('milestones:*');
    }

    this.logger.log(`Milestone deleted successfully: ID ${id}`);
    return { success: true, message: `Milestone ${id} deleted` };
  }

  private calculateMilestoneProgress(milestone: any) {
    // Gather all tasks belonging to stories in this milestone, as well as tasks in its sprints
    const tasksMap = new Map<string, any>();

    if (milestone.epics) {
      for (const epic of milestone.epics) {
        if (epic.stories) {
          for (const story of epic.stories) {
            if (story.tasks) {
              for (const task of story.tasks) {
                tasksMap.set(task.id, task);
              }
            }
          }
        }
      }
    }

    if (milestone.sprints) {
      for (const sprint of milestone.sprints) {
        if (sprint.tasks) {
          for (const task of sprint.tasks) {
            tasksMap.set(task.id, task);
          }
        }
      }
    }

    const allTasks = Array.from(tasksMap.values());
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const inReviewTasks = allTasks.filter((t) => t.status === 'IN_REVIEW').length;
    const todoTasks = allTasks.filter((t) => t.status === 'TODO').length;

    const percentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return {
      ...milestone,
      progress: {
        totalTasks,
        doneTasks,
        inProgressTasks,
        inReviewTasks,
        todoTasks,
        percentage,
      },
    };
  }
}
