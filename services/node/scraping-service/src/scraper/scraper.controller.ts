import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ScraperService } from '@/scraper/scraper.service';
import { FullScrapeRequestDto } from '@/scraper/dto/request/full-scrape-request.dto';

@Controller('scraper')
@ApiTags()
export class ScraperController {
   constructor(private readonly scraperService: ScraperService) {}

   @Post('full-scrape')
   fullScrape(@Query() dto: FullScrapeRequestDto) {
      this.scraperService.scrapePlatform(dto);
   }
}
