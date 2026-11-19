import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcceptanceCriterionDto } from './dto/create-acceptance-criterion.dto';
import { UpdateAcceptanceCriterionDto } from './dto/update-acceptance-criterion.dto';

@Injectable()
export class AcceptanceCriteriaService {
  private readonly logger = new Logger(AcceptanceCriteriaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAcceptanceCriterionDto) {
    this.logger.log(`Creating acceptance criterion: Given "${dto.given}" When "${dto.when}" Then "${dto.then}"`);
    const criterion = await this.prisma.acceptanceCriterion.create({
      data: {
        given: dto.given,
        when: dto.when,
        then: dto.then,
        isMet: dto.isMet ?? false,
        epicId: dto.epicId,
        storyId: dto.storyId,
        taskId: dto.taskId,
      },
      include: {
        epic: true,
        story: true,
        task: true,
      },
    });

    this.logger.log(`Acceptance criterion created: ID ${criterion.id}`);
    return criterion;
  }

  async findAll(epicId?: string, storyId?: string, taskId?: string) {
    this.logger.log(`Finding acceptance criteria [epic: ${epicId}, story: ${storyId}, task: ${taskId}]`);
    return this.prisma.acceptanceCriterion.findMany({
      where: {
        ...(epicId && { epicId }),
        ...(storyId && { storyId }),
        ...(taskId && { taskId }),
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    this.logger.log(`Fetching acceptance criterion ID ${id}`);
    const criterion = await this.prisma.acceptanceCriterion.findUnique({
      where: { id },
      include: {
        epic: true,
        story: true,
        task: true,
      },
    });

    if (!criterion) {
      this.logger.warn(`Acceptance criterion not found: ID ${id}`);
      throw new NotFoundException(`Acceptance criterion with ID ${id} not found`);
    }

    return criterion;
  }

  async update(id: string, dto: UpdateAcceptanceCriterionDto) {
    this.logger.log(`Updating acceptance criterion ID ${id}`);
    await this.findOne(id);

    const updated = await this.prisma.acceptanceCriterion.update({
      where: { id },
      data: {
        ...(dto.given !== undefined && { given: dto.given }),
        ...(dto.when !== undefined && { when: dto.when }),
        ...(dto.then !== undefined && { then: dto.then }),
        ...(dto.isMet !== undefined && { isMet: dto.isMet }),
        ...(dto.epicId !== undefined && { epicId: dto.epicId }),
        ...(dto.storyId !== undefined && { storyId: dto.storyId }),
        ...(dto.taskId !== undefined && { taskId: dto.taskId }),
      },
      include: {
        epic: true,
        story: true,
        task: true,
      },
    });

    this.logger.log(`Acceptance criterion updated: ID ${id}`);
    return updated;
  }

  async toggle(id: string) {
    this.logger.log(`Toggling isMet state for acceptance criterion ID ${id}`);
    const existing = await this.findOne(id);
    const updated = await this.prisma.acceptanceCriterion.update({
      where: { id },
      data: { isMet: !existing.isMet },
    });
    this.logger.log(`Acceptance criterion ${id} toggled to isMet=${updated.isMet}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting acceptance criterion ID ${id}`);
    await this.findOne(id);
    await this.prisma.acceptanceCriterion.delete({ where: { id } });
    this.logger.log(`Acceptance criterion deleted: ID ${id}`);
    return { success: true, message: `Acceptance criterion ${id} deleted` };
  }
}
