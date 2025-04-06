import { Controller, Post, Query } from '@nestjs/common';

import { ScraperService } from '@/scraper/scraper.service';
import { ScrapePlatformRequestDto } from '@/scraper/dto/request/scrape-platform-request.dto';

@Controller('scraper')
export class ScraperController {
   constructor(private readonly scraperService: ScraperService) {}

   @Post('scrape-platform')
   fullScrape(@Query() dto: ScrapePlatformRequestDto) {
      this.scraperService.scrapePlatform(dto);
   }
}
