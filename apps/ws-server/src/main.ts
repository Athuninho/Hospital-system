import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
  console.log('WebSocket Gateway running on port 4000');
}

bootstrap();
