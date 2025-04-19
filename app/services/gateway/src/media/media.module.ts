import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { AppEnv } from '@/common/types/app-env.types';

@Module({
   imports: [
      MulterModule.registerAsync({
         useFactory: () => ({
            limits: { fileSize: 50 * 1024 * 1024 },
         }),
      }),
      ServeStaticModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (conf: ConfigService<AppEnv>) => [
            {
               rootPath: conf.get('STORAGE_PATH'),
               serveRoot: '/media',
               serveStaticOptions: { etag: true },
            },
         ],
      }),
   ],
   exports: [MediaService],
   controllers: [MediaController],
   providers: [MediaService],
})
export class MediaModule {
}
