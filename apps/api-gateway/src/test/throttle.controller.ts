import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('test')
export class ThrottleTestController {
  // low per-second limit useful for integration tests
  @Throttle(5, 60)
  @Get('throttle')
  get() {
    return { ok: true };
  }
}
