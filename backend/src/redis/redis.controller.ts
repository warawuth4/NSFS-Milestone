import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedisService } from './redis.service';
import { RedisStatusDto } from './dto/redis-status.dto';
import { ClearCacheDto } from './dto/clear-cache.dto';

@ApiTags('Cache')
@Controller('cache')
export class RedisController {
  private readonly logger = new Logger(RedisController.name);

  constructor(private readonly redisService: RedisService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Get Redis caching status',
    description: 'Returns the current connection status, active provider, key count, and health of Redis caching.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current Redis cache status retrieved successfully',
    type: RedisStatusDto,
  })
  async getStatus(): Promise<RedisStatusDto> {
    this.logger.log('Querying cache status');
    return this.redisService.getStatus();
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear cached data',
    description: 'Clears either all cached data or keys matching a specific pattern (e.g. "milestones:*").',
  })
  @ApiResponse({
    status: 200,
    description: 'Cache cleared successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Cache cleared successfully' },
        pattern: { type: 'string', example: 'milestones:*' },
      },
    },
  })
  async clearCache(@Body() dto: ClearCacheDto) {
    if (dto.pattern && dto.pattern !== '*') {
      this.logger.log(`Clearing cache pattern: ${dto.pattern}`);
      await this.redisService.delByPattern(dto.pattern);
      return {
        success: true,
        message: `Cache cleared for pattern: ${dto.pattern}`,
        pattern: dto.pattern,
      };
    }

    this.logger.log('Flushing entire cache');
    await this.redisService.flushAll();
    return {
      success: true,
      message: 'All cache cleared successfully',
      pattern: '*',
    };
  }
}
