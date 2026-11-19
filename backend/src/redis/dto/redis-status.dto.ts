import { ApiProperty } from '@nestjs/swagger';

export class RedisStatusDto {
  @ApiProperty({
    description: 'Current connection state of the Redis cache service',
    example: 'connected',
    enum: ['connected', 'fallback_memory', 'disconnected'],
  })
  status: 'connected' | 'fallback_memory' | 'disconnected';

  @ApiProperty({
    description: 'Active caching provider backend',
    example: 'redis',
    enum: ['redis', 'memory'],
  })
  provider: 'redis' | 'memory';

  @ApiProperty({
    description: 'Configured Redis endpoint or identifier',
    example: 'redis://localhost:6379',
  })
  url: string;

  @ApiProperty({
    description: 'Number of active keys cached in memory or Redis',
    example: 12,
  })
  keyCount: number;

  @ApiProperty({
    description: 'Timestamp when the status was queried',
    example: '2026-11-19T16:45:00.000Z',
  })
  timestamp: string;
}
