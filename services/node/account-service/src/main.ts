import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppEnv } from '@/common/types/env';

import { AppModule } from '@/app.module';

async function bootstrap() {
   const logger = new Logger(bootstrap.name, { timestamp: true });
   const app = await NestFactory.create<INestApplication<Express>>(AppModule, {
      logger,
   });
   const config = app.get(ConfigService<AppEnv>);
   const httpPort = config.get('HTTP_PORT');
   const httpHost = config.get('HTTP_HOST');

   app.enableCors({
      origin: '*',
      allowedHeaders: '*',
      methods: '*',
   });
   app.setGlobalPrefix('/api');
   app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
      defaultVersion: '1',
   });

   const swaggerConfig = new DocumentBuilder()
      .setTitle('CarHive Account Service')
      .setVersion('1.0.0')
      .build();

   const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
   SwaggerModule.setup('/docs', app, swaggerDocument, {
      jsonDocumentUrl: '/docs/swagger.json',
      customSiteTitle: 'Account Service docs',
      useGlobalPrefix: true,
   });

   await app.listen(httpPort, httpHost, () =>
      logger.log(`HTTP listening to ${httpHost}:${httpPort}`),
   );
}

bootstrap();
