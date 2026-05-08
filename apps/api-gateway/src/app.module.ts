import { Module } from '@nestjs/common';
import { PrismaModule } from '@hospital/prisma';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
})
export class AppModule {}
