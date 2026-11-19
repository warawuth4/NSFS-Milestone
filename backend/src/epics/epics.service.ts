import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { Status } from '@prisma/client';

@Injectable()
export class EpicsService {
  private readonly logger = new Logger(EpicsService.name);

  constructor(private readonly prisma: PrismaService) {}

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

    this.logger.log(`Epic created successfully: ID ${epic.id}`);
    return epic;
  }

  async findAll(milestoneId?: string) {
    this.logger.log(`Finding epics (milestoneId: ${milestoneId ?? 'all'})`);
    return this.prisma.epic.findMany({
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
  }

  async findOne(id: string) {
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

    this.logger.log(`Epic updated successfully: ID ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting epic ID ${id}`);
    await this.findOne(id);
    await this.prisma.epic.delete({ where: { id } });
    this.logger.log(`Epic deleted successfully: ID ${id}`);
    return { success: true, message: `Epic ${id} deleted` };
  }
}
