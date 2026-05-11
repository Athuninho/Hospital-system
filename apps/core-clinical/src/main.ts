import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/core-clinical');
  const port = process.env.CLINICAL_PORT ? Number(process.env.CLINICAL_PORT) : 3002;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Core Clinical service running on http://localhost:${port}/api/core-clinical`);
}

bootstrap();
