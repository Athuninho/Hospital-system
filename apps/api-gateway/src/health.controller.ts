import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  ready() {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
