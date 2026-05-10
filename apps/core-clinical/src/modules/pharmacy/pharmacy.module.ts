import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { PrismaModule } from '@hospital/prisma';

@Module({
  imports: [PrismaModule],
  providers: [PharmacyService],
  controllers: [PharmacyController],
  exports: [PharmacyService],
})
export class PharmacyModule {}
