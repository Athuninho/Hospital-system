import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  list() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Post()
  create(@Body() payload: any) {
    return this.patientsService.create(payload);
  }
}
