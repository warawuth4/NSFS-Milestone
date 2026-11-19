import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { Status } from '@prisma/client';

@Injectable()
export class EpicsService {
  private readonly logger = new Logger(EpicsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly redis?: RedisService,
  ) {}

  private async invalidateCaches() {
    if (this.redis) {
      await Promise.all([
        this.redis.delByPattern('epics:*'),
        this.redis.delByPattern('milestones:*'),
      ]);
    }
  }

  async create(dto: CreateEpicDto) {
    this.logger.log(`Creating epic: ${dto.title}`);
    const epic = await this.prisma.epic.create({
      data: {
        title: dto.title,
        role: dto.role,
        want: dto.want,
        soThat: dto.soThat,
        description: dto.description,
        status: dto.status || Status.TODO,
        priority: dto.priority,
        milestoneId: dto.milestoneId,
      },
      include: {
        milestone: true,
        stories: true,
        acceptanceCriteria: true,
      },
    });

    await this.invalidateCaches();
    this.logger.log(`Epic created successfully: ID ${epic.id}`);
    return epic;
  }

  async findAll(milestoneId?: string) {
    const cacheKey = `epics:${milestoneId ?? 'all'}`;
    if (this.redis) {
      const cached = await this.redis.get<any[]>(cacheKey);
      if (cached) {
        this.logger.log(`Returning epics from Redis cache (${cacheKey})`);
        return cached;
      }
    }

    this.logger.log(`Finding epics (milestoneId: ${milestoneId ?? 'all'})`);
    const epics = await this.prisma.epic.findMany({
      where: {
        ...(milestoneId && { milestoneId }),
      },
      include: {
        milestone: true,
        stories: {
          include: {
            tasks: true,
            acceptanceCriteria: true,
          },
        },
        acceptanceCriteria: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (this.redis) {
      await this.redis.set(cacheKey, epics, 60);
    }

    return epics;
  }

  async findOne(id: string) {
    const cacheKey = `epics:id:${id}`;
    if (this.redis) {
      const cached = await this.redis.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    this.logger.log(`Fetching epic ID ${id}`);
    const epic = await this.prisma.epic.findUnique({
      where: { id },
      include: {
        milestone: true,
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
    });

    if (!epic) {
      this.logger.warn(`Epic not found: ID ${id}`);
      throw new NotFoundException(`Epic with ID ${id} not found`);
    }

    if (this.redis) {
      await this.redis.set(cacheKey, epic, 60);
    }

    return epic;
  }

  async update(id: string, dto: UpdateEpicDto) {
    this.logger.log(`Updating epic ID ${id}`);
    await this.findOne(id);

    const updated = await this.prisma.epic.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.want !== undefined && { want: dto.want }),
        ...(dto.soThat !== undefined && { soThat: dto.soThat }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.milestoneId !== undefined && { milestoneId: dto.milestoneId }),
      },
      include: {
        milestone: true,
        stories: true,
        acceptanceCriteria: true,
      },
    });

    await this.invalidateCaches();
    this.logger.log(`Epic updated successfully: ID ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting epic ID ${id}`);
    await this.findOne(id);
    await this.prisma.epic.delete({ where: { id } });

    await this.invalidateCaches();
    this.logger.log(`Epic deleted successfully: ID ${id}`);
    return { success: true, message: `Epic ${id} deleted` };
  }
}
