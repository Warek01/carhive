import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { AppQueueName } from '@/common/enums/app-queue-name.enum';

@Module({
   imports: [
      BullModule.registerQueue({
         name: AppQueueName.Scraping,
      }),
   ],
   controllers: [ScraperController],
   providers: [ScraperService],
   exports: [],
})
export class ScraperModule {}
