import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@/app.module';
import { AppEnv } from '@/common/types/app-env';

async function bootstrap() {
   const logger = new Logger(bootstrap.name, { timestamp: true });
   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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
   app.set('query parser', 'extended');

   const swaggerConfig = new DocumentBuilder()
      .setTitle('CarHive Recommendation Service')
      .setVersion('1.0.0')
      .addGlobalParameters({
         in: 'header',
         required: true,
         name: 'X-API-KEY',
         style: 'simple',
         allowEmptyValue: false,
         schema: {
            default: 'secret-key',
         },
      })
      .build();

   const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
   SwaggerModule.setup('/docs', app, swaggerDocument, {
      jsonDocumentUrl: '/docs/swagger.json',
      customSiteTitle: 'Recommendation Service docs',
      useGlobalPrefix: true,
   });

   await app.listen(httpPort, httpHost, () =>
      logger.log(`HTTP listening to ${httpHost}:${httpPort}`),
   );
}

bootstrap();
