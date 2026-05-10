import { Module } from '@nestjs/common';
import { PatientsModule } from './modules/patients/patients.module';
import { EncountersModule } from './modules/encounters/encounters.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BillingModule } from './modules/billing/billing.module';
import { PrismaModule } from '@hospital/prisma';

@Module({
  imports: [
    PrismaModule, 
    PatientsModule, 
    EncountersModule, 
    OrdersModule,
    AppointmentsModule,
    BillingModule,
  ],

  controllers: [],
  providers: []
})
export class AppModule {}


