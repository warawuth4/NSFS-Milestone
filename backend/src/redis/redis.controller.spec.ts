import { Test, TestingModule } from '@nestjs/testing';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

describe('RedisController (Unit)', () => {
  let controller: RedisController;
  let redisService: any;

  beforeEach(async () => {
    redisService = {
      getStatus: jest.fn().mockResolvedValue({
        status: 'connected',
        provider: 'redis',
        url: 'redis://localhost:6379',
        keyCount: 5,
        timestamp: new Date().toISOString(),
      }),
      delByPattern: jest.fn().mockResolvedValue(undefined),
      flushAll: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisController],
      providers: [{ provide: RedisService, useValue: redisService }],
    }).compile();

    controller = module.get<RedisController>(RedisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return cache status from GET /cache/status', async () => {
    const status = await controller.getStatus();
    expect(status.status).toBe('connected');
    expect(status.provider).toBe('redis');
    expect(status.keyCount).toBe(5);
    expect(redisService.getStatus).toHaveBeenCalled();
  });

  it('should clear specific pattern from POST /cache/clear', async () => {
    const result = await controller.clearCache({ pattern: 'milestones:*' });
    expect(result.success).toBe(true);
    expect(result.pattern).toBe('milestones:*');
    expect(redisService.delByPattern).toHaveBeenCalledWith('milestones:*');
    expect(redisService.flushAll).not.toHaveBeenCalled();
  });

  it('should flush all cache when pattern is not specified or "*"', async () => {
    const result = await controller.clearCache({});
    expect(result.success).toBe(true);
    expect(result.pattern).toBe('*');
    expect(redisService.flushAll).toHaveBeenCalled();
  });
});
