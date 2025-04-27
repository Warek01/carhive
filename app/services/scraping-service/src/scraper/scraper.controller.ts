import { Controller, Get, Post, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiOkResponse } from '@nestjs/swagger';

import { ScraperService } from '@/scraper/scraper.service';
import { ScrapePlatformRequestDto } from '@/scraper/dto/request/scrape-platform-request.dto';
import { GetHistoryResponseDto } from '@/scraper/dto/response/get-history-response.dto';

@Controller('scraper')
export class ScraperController {
   constructor(private readonly scraperService: ScraperService) {}

   @Post('scrape-platform')
   fullScrape(@Query() dto: ScrapePlatformRequestDto) {
      this.scraperService.scrapePlatform(dto);
   }

   @Get()
   @ApiOkResponse({ type: GetHistoryResponseDto })
   async getHistory(): Promise<GetHistoryResponseDto> {
      const [history, count] = await this.scraperService.getHistory();
      return plainToInstance(GetHistoryResponseDto, {
         items: history,
         totalItems: count,
         page: 0,
      });
   }
}
