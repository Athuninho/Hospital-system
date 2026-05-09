import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/core-clinical');
  const port = process.env.PORT ? Number(process.env.PORT) : 3333;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Core Clinical service running on http://localhost:${port}/api/core-clinical`);
}

bootstrap();
