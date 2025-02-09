import { Controller, Post, Query } from '@nestjs/common';
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
}
