import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ScrapingBatch } from '@/scraper/types/scraping-batch.types';

@Controller()
export class ScraperController {
   @MessagePattern('scraping')
   scrape(data: ScrapingBatch) {
      console.log(data);
   }
}
