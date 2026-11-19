import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

describe('RedisService (Unit)', () => {
  let service: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'REDIS_URL') return 'redis://localhost:6379';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should report fallback status when Redis is not running locally', async () => {
    const status = await service.getStatus();
    expect(status).toBeDefined();
    expect(['connected', 'fallback_memory']).toContain(status.status);
    expect(status.url).toContain('redis://localhost:6379');
    expect(typeof status.keyCount).toBe('number');
  });

  it('should set and get values with TTL correctly', async () => {
    await service.set('test:key1', { hello: 'world' }, 10);
    const result = await service.get<{ hello: string }>('test:key1');
    expect(result).toEqual({ hello: 'world' });
  });

  it('should return null for non-existent keys', async () => {
    const result = await service.get('test:nonexistent');
    expect(result).toBeNull();
  });

  it('should delete a specific key', async () => {
    await service.set('test:delete-me', 'data', 10);
    expect(await service.get('test:delete-me')).toBe('data');

    await service.del('test:delete-me');
    expect(await service.get('test:delete-me')).toBeNull();
  });

  it('should delete keys matching wildcard pattern', async () => {
    await service.set('milestones:all', [{ id: 'm1' }], 10);
    await service.set('milestones:m1', { id: 'm1' }, 10);
    await service.set('tasks:all', [{ id: 't1' }], 10);

    await service.delByPattern('milestones:*');

    expect(await service.get('milestones:all')).toBeNull();
    expect(await service.get('milestones:m1')).toBeNull();
    expect(await service.get('tasks:all')).toEqual([{ id: 't1' }]);
  });

  it('should flush all keys', async () => {
    await service.set('k1', 'val1');
    await service.set('k2', 'val2');

    await service.flushAll();

    expect(await service.get('k1')).toBeNull();
    expect(await service.get('k2')).toBeNull();
  });
});
