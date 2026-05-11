import { Module } from '@nestjs/common';
import { PrismaModule } from '@hospital/prisma';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottleTestController } from './test/throttle.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
  ],
  controllers: [HealthController],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

// include test controllers only in test env
if (process.env.NODE_ENV === 'test') {
  // Dynamically add the test controller to module metadata at runtime isn't trivial;
  // instead export the controller so tests can import it into a testing module.
}
