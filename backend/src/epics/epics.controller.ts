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
import { EpicsService } from './epics.service';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';

@ApiTags('Epics')
@Controller('epics')
export class EpicsController {
  private readonly logger = new Logger(EpicsController.name);

  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an Epic using "As a ..., I want to ..., so that..." template',
  })
  @ApiResponse({ status: 201, description: 'Epic created successfully' })
  create(@Body() createEpicDto: CreateEpicDto) {
    this.logger.log(`POST /epics - ${createEpicDto.title}`);
    return this.epicsService.create(createEpicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all epics, optionally filtered by milestoneId' })
  @ApiQuery({ name: 'milestoneId', required: false, description: 'Milestone UUID' })
  @ApiResponse({ status: 200, description: 'List of epics' })
  findAll(@Query('milestoneId') milestoneId?: string) {
    this.logger.log(`GET /epics [milestoneId: ${milestoneId}]`);
    return this.epicsService.findAll(milestoneId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get epic by ID with nested user stories and acceptance criteria' })
  @ApiParam({ name: 'id', description: 'Epic UUID' })
  @ApiResponse({ status: 200, description: 'Epic found' })
  @ApiResponse({ status: 404, description: 'Epic not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /epics/${id}`);
    return this.epicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an epic' })
  @ApiParam({ name: 'id', description: 'Epic UUID' })
  @ApiResponse({ status: 200, description: 'Epic updated' })
  update(@Param('id') id: string, @Body() updateEpicDto: UpdateEpicDto) {
    this.logger.log(`PATCH /epics/${id}`);
    return this.epicsService.update(id, updateEpicDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an epic' })
  @ApiParam({ name: 'id', description: 'Epic UUID' })
  @ApiResponse({ status: 200, description: 'Epic deleted' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /epics/${id}`);
    return this.epicsService.remove(id);
  }
}
