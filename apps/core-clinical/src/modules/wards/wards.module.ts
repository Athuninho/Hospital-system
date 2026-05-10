import { Module } from '@nestjs/common';
import { WardsService } from './wards.service';
import { WardsController } from './wards.controller';
import { PrismaModule } from '@hospital/prisma';

@Module({
  imports: [PrismaModule],
  providers: [WardsService],
  controllers: [WardsController],
  exports: [WardsService],
})
export class WardsModule {}
