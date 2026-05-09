import { Controller, Get, Post, Param, Body } from '@nestjs/common';
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
}
