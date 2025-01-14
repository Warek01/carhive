import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { ScraperController } from '@/scraper/scraper.controller';
import { ScraperService } from '@/scraper/scraper.service';
import { AppEnv } from '@/common/types/app-env';
import { SCRAPER_QUEUE_TOKEN } from '@/scraper/constants/injection-tokens.constants';

@Module({
   imports: [
      ClientsModule.registerAsync([
         {
            name: SCRAPER_QUEUE_TOKEN,
            inject: [ConfigService],
            useFactory: (config: ConfigService<AppEnv>) => ({
               transport: Transport.RMQ,
               options: {
                  urls: [config.get<string>('MESSAGE_QUEUE_URL')!],
                  queue: 'scraping',
                  queueOptions: {
                     durable: true,
                  },
               },
            }),
         },
      ]),
   ],
   controllers: [ScraperController],
   providers: [ScraperService],
   exports: [],
})
export class ScraperModule {}
