import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('test')
export class ThrottleTestController {
  // low per-second limit useful for integration tests
  @Throttle({ limit: 5, ttl: 60 } as any)
  @Get('throttle')
  get() {
    return { ok: true };
  }
}
