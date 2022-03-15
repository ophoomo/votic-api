import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Version-Header',
  });
  await app.listen(process.env.APP_PORT);
}
bootstrap();
