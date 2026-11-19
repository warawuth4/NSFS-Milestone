import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { RedisModule } from './redis.module';
import { ConfigModule } from '@nestjs/config';

describe('RedisModule (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /cache/status returns 200 with valid RedisStatusDto schema', async () => {
    const res = await request(app.getHttpServer()).get('/cache/status').expect(200);

    expect(res.body).toBeDefined();
    expect(['connected', 'fallback_memory', 'disconnected']).toContain(res.body.status);
    expect(['redis', 'memory']).toContain(res.body.provider);
    expect(typeof res.body.keyCount).toBe('number');
    expect(typeof res.body.url).toBe('string');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('POST /cache/clear clears cache and returns 200', async () => {
    const res = await request(app.getHttpServer())
      .post('/cache/clear')
      .send({ pattern: 'milestones:*' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.pattern).toBe('milestones:*');
  });

  it('POST /cache/clear without pattern flushes entire cache', async () => {
    const res = await request(app.getHttpServer())
      .post('/cache/clear')
      .send({})
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.pattern).toBe('*');
  });
});
