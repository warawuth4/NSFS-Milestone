import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { SprintStatus } from '@prisma/client';

@ApiTags('Sprints')
@Controller('sprints')
export class SprintsController {
  private readonly logger = new Logger(SprintsController.name);

  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sprint' })
  @ApiResponse({ status: 201, description: 'Sprint created successfully' })
  create(@Body() createSprintDto: CreateSprintDto) {
    this.logger.log(`POST /sprints - ${createSprintDto.name}`);
    return this.sprintsService.create(createSprintDto);
  }

  @Get()
  @ApiOperation({ summary: 'List sprints, optionally filtered by milestoneId or status' })
  @ApiQuery({ name: 'milestoneId', required: false, description: 'Filter by Milestone UUID' })
  @ApiQuery({ name: 'status', enum: SprintStatus, required: false, description: 'Filter by Sprint Status' })
  @ApiResponse({ status: 200, description: 'List of sprints with task metrics' })
  findAll(
    @Query('milestoneId') milestoneId?: string,
    @Query('status') status?: SprintStatus,
  ) {
    this.logger.log(`GET /sprints [milestoneId: ${milestoneId}, status: ${status}]`);
    return this.sprintsService.findAll(milestoneId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sprint by ID with assigned tasks and metrics' })
  @ApiParam({ name: 'id', description: 'Sprint UUID' })
  @ApiResponse({ status: 200, description: 'Sprint found' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /sprints/${id}`);
    return this.sprintsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing sprint' })
  @ApiParam({ name: 'id', description: 'Sprint UUID' })
  @ApiResponse({ status: 200, description: 'Sprint updated' })
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    this.logger.log(`PATCH /sprints/${id}`);
    return this.sprintsService.update(id, updateSprintDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a sprint' })
  @ApiParam({ name: 'id', description: 'Sprint UUID' })
  @ApiResponse({ status: 200, description: 'Sprint deleted' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /sprints/${id}`);
    return this.sprintsService.remove(id);
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Assign a task to this sprint (Requirement 6)' })
  @ApiParam({ name: 'id', description: 'Sprint UUID' })
  @ApiResponse({ status: 200, description: 'Task assigned to sprint' })
  assignTask(@Param('id') id: string, @Body() dto: AssignTaskDto) {
    this.logger.log(`POST /sprints/${id}/tasks - Task: ${dto.taskId}`);
    return this.sprintsService.assignTask(id, dto.taskId);
  }

  @Delete(':id/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a task from this sprint back to backlog' })
  @ApiParam({ name: 'id', description: 'Sprint UUID' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task removed from sprint' })
  unassignTask(@Param('id') id: string, @Param('taskId') taskId: string) {
    this.logger.log(`DELETE /sprints/${id}/tasks/${taskId}`);
    return this.sprintsService.unassignTask(taskId);
  }
}
