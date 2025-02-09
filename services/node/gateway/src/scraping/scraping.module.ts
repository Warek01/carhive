import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { ScrapingService } from '@/scraping/scraping.service';
import { ScrapingController } from '@/scraping/scraping.controller';
import { AppEnv } from '@/common/types/app-env';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
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
