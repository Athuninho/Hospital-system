import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '@hospital/prisma';

describe('Throttling (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // provide a lightweight mock for PrismaService so tests don't require a DB
    const mockPrisma = {
      $connect: async () => {},
      $disconnect: async () => {},
    } as any;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ThrottlerModule.forRoot({ ttl: 60, limit: 5 })],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('health endpoint should be exempt from throttling', async () => {
    for (let i = 0; i < 12; i++) {
      const res = await request(app.getHttpServer()).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    }
  });

  it('throttled endpoint should return 429 after limit', async () => {
    // hit the throttled test endpoint limit+1 times
    for (let i = 0; i < 6; i++) {
      const res = await request(app.getHttpServer()).get('/api/v1/test/throttle');
      if (i < 5) {
        expect(res.status).toBe(200);
      } else {
        expect(res.status).toBe(429);
      }
    }
  });
});
