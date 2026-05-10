import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { MpesaService } from './mpesa.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '@hospital/prisma';

@Module({
  imports: [PrismaModule],
  providers: [BillingService, MpesaService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}

