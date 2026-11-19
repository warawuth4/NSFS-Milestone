import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@ApiTags('Milestones')
@Controller('milestones')
export class MilestonesController {
  private readonly logger = new Logger(MilestonesController.name);

  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project milestone' })
  @ApiResponse({ status: 201, description: 'Milestone created successfully' })
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    this.logger.log(`POST /milestones - ${createMilestoneDto.title}`);
    return this.milestonesService.create(createMilestoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all project milestones with task progress aggregation' })
  @ApiResponse({ status: 200, description: 'List of milestones with progress metrics' })
  findAll() {
    this.logger.log('GET /milestones');
    return this.milestonesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get milestone by ID with detailed sprints, epics, stories, and tasks' })
  @ApiParam({ name: 'id', description: 'Milestone UUID' })
  @ApiResponse({ status: 200, description: 'Milestone found' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /milestones/${id}`);
    return this.milestonesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing milestone' })
  @ApiParam({ name: 'id', description: 'Milestone UUID' })
  @ApiResponse({ status: 200, description: 'Milestone updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    this.logger.log(`PATCH /milestones/${id}`);
    return this.milestonesService.update(id, updateMilestoneDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a milestone' })
  @ApiParam({ name: 'id', description: 'Milestone UUID' })
  @ApiResponse({ status: 200, description: 'Milestone deleted successfully' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /milestones/${id}`);
    return this.milestonesService.remove(id);
  }
}
