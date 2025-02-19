import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';

import { ScrapingService } from '@/scraping/scraping.service';
import { ScrapingController } from '@/scraping/scraping.controller';
import { AppEnv } from '@/common/types/app-env.types';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            paramsSerializer: (obj) => qs.stringify(obj),
            baseURL: `${config.get('SCRAPING_SERVICE_URL')}/api/v1/scraping/`,
            headers: {
               'X-API-KEY': config.get('SCRAPING_SERVICE_API_KEY'),
            },
         }),
      }),
   ],
   controllers: [ScrapingController],
   providers: [ScrapingService],
   exports: [],
})
export class ScrapingModule {}
