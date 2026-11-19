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
import { AcceptanceCriteriaService } from './acceptance-criteria.service';
import { CreateAcceptanceCriterionDto } from './dto/create-acceptance-criterion.dto';
import { UpdateAcceptanceCriterionDto } from './dto/update-acceptance-criterion.dto';

@ApiTags('Acceptance Criteria')
@Controller('acceptance-criteria')
export class AcceptanceCriteriaController {
  private readonly logger = new Logger(AcceptanceCriteriaController.name);

  constructor(
    private readonly criteriaService: AcceptanceCriteriaService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create an acceptance criterion using "Given ..., When ..., Then ..." template (Requirement 2)',
  })
  @ApiResponse({ status: 201, description: 'Acceptance criterion created' })
  create(@Body() dto: CreateAcceptanceCriterionDto) {
    this.logger.log(`POST /acceptance-criteria - Given ${dto.given}`);
    return this.criteriaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get acceptance criteria filtered by epicId, storyId, or taskId' })
  @ApiQuery({ name: 'epicId', required: false })
  @ApiQuery({ name: 'storyId', required: false })
  @ApiQuery({ name: 'taskId', required: false })
  @ApiResponse({ status: 200, description: 'List of acceptance criteria' })
  findAll(
    @Query('epicId') epicId?: string,
    @Query('storyId') storyId?: string,
    @Query('taskId') taskId?: string,
  ) {
    this.logger.log(`GET /acceptance-criteria [epicId: ${epicId}, storyId: ${storyId}, taskId: ${taskId}]`);
    return this.criteriaService.findAll(epicId, storyId, taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get acceptance criterion by ID' })
  @ApiParam({ name: 'id', description: 'Criterion UUID' })
  @ApiResponse({ status: 200, description: 'Criterion found' })
  @ApiResponse({ status: 404, description: 'Criterion not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /acceptance-criteria/${id}`);
    return this.criteriaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update acceptance criterion' })
  @ApiParam({ name: 'id', description: 'Criterion UUID' })
  @ApiResponse({ status: 200, description: 'Criterion updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAcceptanceCriterionDto,
  ) {
    this.logger.log(`PATCH /acceptance-criteria/${id}`);
    return this.criteriaService.update(id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle isMet condition for acceptance criterion' })
  @ApiParam({ name: 'id', description: 'Criterion UUID' })
  @ApiResponse({ status: 200, description: 'Criterion isMet status toggled' })
  toggle(@Param('id') id: string) {
    this.logger.log(`PATCH /acceptance-criteria/${id}/toggle`);
    return this.criteriaService.toggle(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete acceptance criterion' })
  @ApiParam({ name: 'id', description: 'Criterion UUID' })
  @ApiResponse({ status: 200, description: 'Criterion deleted' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /acceptance-criteria/${id}`);
    return this.criteriaService.remove(id);
  }
}
