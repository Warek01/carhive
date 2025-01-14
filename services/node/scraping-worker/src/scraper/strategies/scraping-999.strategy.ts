import { Logger } from '@nestjs/common';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export class Scraping999Strategy extends BaseScrapingStrategy {
   protected readonly PLATFORM = SupportedPlatform.TripleNineMd;
   protected readonly logger = new Logger(Scraping999Strategy.name);

   protected async extract(): Promise<string[]> {
      return [];
   }
}
