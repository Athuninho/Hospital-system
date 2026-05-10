import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { LabService } from './lab.service';

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Get('requests/pending')
  getPending(@Query('hospitalId') hospitalId: string) {
    return this.labService.getPendingRequests(hospitalId);
  }

  @Post('requests/:id/report')
  report(@Param('id') id: string, @Body() data: any) {
    return this.labService.reportResult(id, data);
  }

  @Get('results')
  getResults(@Query('patientId') patientId: string) {
    return this.labService.getResults(patientId);
  }
}
