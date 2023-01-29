import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

Object.keys(process.env)
  .filter((k) => k.startsWith('TWITCH_FARMER_API_'))
  .forEach((k) => {
    const nKey = k.replace('TWITCH_FARMER_API_', '');
    process.env[nKey] = process.env[k];
  });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
