import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller('health')
class HealthController { @Get() ready() { return { ws: 'ok' }; } }

@Module({ controllers: [HealthController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('ws');
  await app.listen(4000);
  console.log('WebSocket server (gateway) running on port 4000');
}

bootstrap();
