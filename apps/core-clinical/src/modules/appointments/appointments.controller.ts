import { Controller, Get, Post, Patch, Body, Query, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll(
    @Query('hospitalId') hospitalId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
  ) {
    return this.appointmentsService.findAll({ hospitalId, doctorId, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.appointmentsService.create({
      ...data,
      scheduledAt: new Date(data.scheduledAt),
    });
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Get('availability/:doctorId')
  getAvailability(@Param('doctorId') doctorId: string, @Query('date') date: string) {
    return this.appointmentsService.getAvailability(doctorId, new Date(date));
  }
}
