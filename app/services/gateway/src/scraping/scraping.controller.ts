import { Controller, Get, Post, Query } from '@nestjs/common';
import {
   ApiCookieAuth,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
} from '@nestjs/swagger';

import { ScrapingService } from '@/scraping/scraping.service';
import { Role } from '@/auth/decorators/roles.decroator';
import { UserRole } from '@/user/enums/user-role.enum';
import { ScrapePlatformRequestDto } from '@/scraping/dto/request/scrape-platform-request.dto';
import { GetHistoryResponseDto } from '@/scraping/dto/response/get-history-response.dto';

@Controller('scraping')
@ApiCookieAuth()
@ApiTags('Scraping')
@Role(UserRole.Admin)
export class ScrapingController {
   constructor(private readonly scrapingService: ScrapingService) {}

   @Post('scrape-page')
   @ApiOperation({
      summary: 'Start scraping a single platform',
      description: 'Roles: <b>Admin</b>',
   })
   @ApiOkResponse()
   scrapePage(@Query() dto: ScrapePlatformRequestDto): Promise<void> {
      return this.scrapingService.scrapePage(dto);
   }

   @Get()
   @ApiOperation({
      summary: 'Get history of past scrapes',
      description: 'Roles: <b>Admin</b>',
   })
   @ApiOkResponse({ type: GetHistoryResponseDto })
   async getHistory(): Promise<GetHistoryResponseDto> {
      return this.scrapingService.getHistory();
   }
}
