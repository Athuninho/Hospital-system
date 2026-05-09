import { Module } from '@nestjs/common';
import { PatientsModule } from './modules/patients/patients.module';
import { EncountersModule } from './modules/encounters/encounters.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PatientsModule, EncountersModule, OrdersModule],
  controllers: [],
  providers: []
})
export class AppModule {}
