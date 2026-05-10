import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { WardsService } from './wards.service';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  list(@Query('hospitalId') hospitalId: string) {
    return this.wardsService.getWards(hospitalId);
  }

  @Post('admissions')
  admit(@Body() data: { patientId: string; bedId: string; notes?: string }) {
    return this.wardsService.admitPatient(data);
  }

  @Patch('admissions/:id/discharge')
  discharge(@Param('id') id: string) {
    return this.wardsService.dischargePatient(id);
  }
}
