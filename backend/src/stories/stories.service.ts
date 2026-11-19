import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Status } from '@prisma/client';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly redis?: RedisService,
  ) {}

  private async invalidateCaches() {
    if (this.redis) {
      await Promise.all([
        this.redis.delByPattern('stories:*'),
        this.redis.delByPattern('epics:*'),
        this.redis.delByPattern('milestones:*'),
      ]);
    }
  }

  async create(dto: CreateStoryDto) {
    this.logger.log(`Creating story: ${dto.title}`);
    const story = await this.prisma.story.create({
      data: {
        title: dto.title,
        role: dto.role,
        want: dto.want,
        soThat: dto.soThat,
        description: dto.description,
        status: dto.status || Status.TODO,
        priority: dto.priority,
        epicId: dto.epicId && dto.epicId.trim() !== '' ? dto.epicId : null,
      },
      include: {
        epic: true,
        tasks: true,
        acceptanceCriteria: true,
      },
    });

    await this.invalidateCaches();
    this.logger.log(`Story created successfully: ID ${story.id}`);
    return story;
  }

  async findAll(epicId?: string) {
    const cacheKey = `stories:${epicId ?? 'all'}`;
    if (this.redis) {
      const cached = await this.redis.get<any[]>(cacheKey);
      if (cached) {
        this.logger.log(`Returning stories from Redis cache (${cacheKey})`);
        return cached;
      }
    }

    this.logger.log(`Finding stories (epicId: ${epicId ?? 'all'})`);
    const stories = await this.prisma.story.findMany({
      where: {
        ...(epicId && { epicId }),
      },
      include: {
        epic: true,
        tasks: {
          include: {
            sprint: true,
            acceptanceCriteria: true,
          },
        },
        acceptanceCriteria: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (this.redis) {
      await this.redis.set(cacheKey, stories, 60);
    }

    return stories;
  }

  async findOne(id: string) {
    const cacheKey = `stories:id:${id}`;
    if (this.redis) {
      const cached = await this.redis.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    this.logger.log(`Fetching story ID ${id}`);
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        epic: {
          include: {
            milestone: true,
          },
        },
        tasks: {
          include: {
            sprint: true,
            acceptanceCriteria: true,
          },
        },
        acceptanceCriteria: true,
      },
    });

    if (!story) {
      this.logger.warn(`Story not found: ID ${id}`);
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    if (this.redis) {
      await this.redis.set(cacheKey, story, 60);
    }

    return story;
  }

  async update(id: string, dto: UpdateStoryDto) {
    this.logger.log(`Updating story ID ${id}`);
    await this.findOne(id);

    const updated = await this.prisma.story.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.want !== undefined && { want: dto.want }),
        ...(dto.soThat !== undefined && { soThat: dto.soThat }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.epicId !== undefined && {
          epicId: dto.epicId && dto.epicId.trim() !== '' ? dto.epicId : null,
        }),
      },
      include: {
        epic: true,
        tasks: true,
        acceptanceCriteria: true,
      },
    });

    await this.invalidateCaches();
    this.logger.log(`Story updated successfully: ID ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting story ID ${id}`);
    await this.findOne(id);
    await this.prisma.story.delete({ where: { id } });

    await this.invalidateCaches();
    this.logger.log(`Story deleted successfully: ID ${id}`);
    return { success: true, message: `Story ${id} deleted` };
  }
}
