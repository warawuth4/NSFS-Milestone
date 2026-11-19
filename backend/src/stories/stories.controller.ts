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
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  private readonly logger = new Logger(StoriesController.name);

  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user story using "As a ..., I want to ..., so that..." template',
  })
  @ApiResponse({ status: 201, description: 'Story created successfully' })
  create(@Body() createStoryDto: CreateStoryDto) {
    this.logger.log(`POST /stories - ${createStoryDto.title}`);
    return this.storiesService.create(createStoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user stories, optionally filtered by epicId' })
  @ApiQuery({ name: 'epicId', required: false, description: 'Epic UUID' })
  @ApiResponse({ status: 200, description: 'List of stories' })
  findAll(@Query('epicId') epicId?: string) {
    this.logger.log(`GET /stories [epicId: ${epicId}]`);
    return this.storiesService.findAll(epicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get story by ID with tasks and acceptance criteria' })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({ status: 200, description: 'Story found' })
  @ApiResponse({ status: 404, description: 'Story not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /stories/${id}`);
    return this.storiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user story' })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({ status: 200, description: 'Story updated' })
  update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
    this.logger.log(`PATCH /stories/${id}`);
    return this.storiesService.update(id, updateStoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user story' })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({ status: 200, description: 'Story deleted' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /stories/${id}`);
    return this.storiesService.remove(id);
  }
}
