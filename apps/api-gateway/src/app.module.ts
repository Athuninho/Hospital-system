import { Module } from '@nestjs/common';
import { PrismaModule } from '@hospital/prisma';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
  ],
  controllers: [HealthController],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
