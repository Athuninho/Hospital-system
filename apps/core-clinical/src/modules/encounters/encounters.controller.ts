import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { EncountersService } from './encounters.service';

@Controller('encounters')
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  @Get()
  list() {
    return this.encountersService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.encountersService.findOne(id);
  }

  @Post()
  create(@Body() payload: any) {
    return this.encountersService.create(payload);
  }

  @Post(':id/prescriptions')
  addPrescription(@Param('id') id: string, @Body() payload: any) {
    return this.encountersService.addPrescription(id, payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: any) {
    return this.encountersService.update(id, payload);
  }


  @Post(':id/lab-requests')
  addLabRequest(@Param('id') id: string, @Body() payload: any) {
    return this.encountersService.addLabRequest(id, payload);
  }

  @Post(':id/files')
  addFile(@Param('id') id: string, @Body() payload: any) {
    return this.encountersService.addFileAttachment(id, payload);
  }
}


