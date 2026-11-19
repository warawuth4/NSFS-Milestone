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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Status } from '@prisma/client';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a task using "As a ..., I want to ..., so that..." template',
  })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`POST /tasks - ${createTaskDto.title}`);
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters (storyId, sprintId, status)' })
  @ApiQuery({ name: 'storyId', required: false, description: 'Story UUID' })
  @ApiQuery({ name: 'sprintId', required: false, description: 'Sprint UUID' })
  @ApiQuery({ name: 'status', enum: Status, required: false, description: 'Task status' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  findAll(
    @Query('storyId') storyId?: string,
    @Query('sprintId') sprintId?: string,
    @Query('status') status?: Status,
  ) {
    this.logger.log(`GET /tasks [storyId: ${storyId}, sprintId: ${sprintId}, status: ${status}]`);
    return this.tasksService.findAll(storyId, sprintId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /tasks/${id}`);
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task details' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    this.logger.log(`PATCH /tasks/${id}`);
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Quick-update task progress status in 2 clicks (Requirements 7 & 8)',
  })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task progress status changed' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    this.logger.log(`PATCH /tasks/${id}/status -> ${updateTaskStatusDto.status}`);
    return this.tasksService.updateStatus(id, updateTaskStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /tasks/${id}`);
    return this.tasksService.remove(id);
  }
}
