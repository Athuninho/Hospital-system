import { Module } from '@nestjs/common';
import { PrismaModule } from '@hospital/prisma';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule {}
