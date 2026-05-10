import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('inventory/search')
  search(@Query('q') q: string, @Query('hospitalId') hospitalId: string) {
    return this.pharmacyService.searchInventory(q, hospitalId);
  }

  @Get('prescriptions/pending')
  getPending(@Query('hospitalId') hospitalId: string) {
    return this.pharmacyService.getPendingPrescriptions(hospitalId);
  }

  @Post('inventory')
  add(@Body() data: any) {
    return this.pharmacyService.addInventory(data);
  }

  @Post('prescriptions/:id/fulfill')
  fulfill(@Param('id') id: string) {
    return this.pharmacyService.fulfillPrescription(id);
  }
}
