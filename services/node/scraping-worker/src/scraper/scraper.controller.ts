import { Controller } from '@nestjs/common';
import {
   Ctx,
   MessagePattern,
   Payload,
   RmqContext,
} from '@nestjs/microservices';

import { ScrapingBatch } from '@/scraper/types/scraping-batch.types';
import { ScraperService } from '@/scraper/scraper.service';
import { ack } from '@/common/functions/ack';

@Controller()
export class ScraperController {
   constructor(private readonly scraperService: ScraperService) {}

   @MessagePattern('scraping')
   async scrapePlatform(
      @Payload() data: ScrapingBatch,
      @Ctx() ctx: RmqContext,
   ): Promise<void> {
      await this.scraperService.scrapePlatform(data);
      ack(ctx);
   }
}
