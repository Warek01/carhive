import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ScraperService } from '@/scraper/scraper.service';

@Controller('scraper')
@ApiTags()
export class ScraperController {
   constructor(private readonly scraperService: ScraperService) {}
}
