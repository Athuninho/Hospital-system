import { Module } from '@nestjs/common';
import { PatientsModule } from './modules/patients/patients.module';
import { EncountersModule } from './modules/encounters/encounters.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BillingModule } from './modules/billing/billing.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { LabModule } from './modules/lab/lab.module';
import { PrismaModule } from '@hospital/prisma';

@Module({
  imports: [
    PrismaModule, 
    PatientsModule, 
    EncountersModule, 
    OrdersModule,
    AppointmentsModule,
    BillingModule,
    PharmacyModule,
    LabModule,
  ],



  controllers: [],
  providers: []
})
export class AppModule {}


