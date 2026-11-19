import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cache (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/cache/status (GET) returns cache status and provider info', () => {
    return request(app.getHttpServer())
      .get('/cache/status')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBeDefined();
        expect(res.body.provider).toBeDefined();
        expect(typeof res.body.keyCount).toBe('number');
      });
  });

  it('/cache/clear (POST) flushes cache and returns success', () => {
    return request(app.getHttpServer())
      .post('/cache/clear')
      .send({ pattern: '*' })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });
});
