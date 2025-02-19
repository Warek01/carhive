import { Logger } from '@nestjs/common';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export class Scraping999Strategy extends BaseScrapingStrategy {
   protected readonly PAGE_BASE_URL =
      'https://999.md/ro/list/transport/cars?hide_duplicates=yes&sort_type=date_desc&view_type=short';
   protected readonly PLATFORM = SupportedPlatform.TripleNineMd;

   protected readonly logger = new Logger(Scraping999Strategy.name);

   protected async extract(): Promise<string[]> {
      const list = await this.page.$('div[data-sentry-component="AdList"]');

      if (!list) {
         this.logger.error('Cars list is not defined');
         return [];
      }

      const itemSelector = 'div[data-sentry-component = "AdShort"]';
      const skipBoosterModifier = ':not(:has([class ^= "AdShort_booster"]))';
      const linkSelector = 'a[data-sentry-element = "MyLink"]';

      return list.$$eval(
         `${itemSelector}${skipBoosterModifier} ${linkSelector}`,
         (links) => links.map((a) => a.href),
      );
   }

   protected getPageUrl(pageIndex?: number): URL {
      const url = new URL(this.PAGE_BASE_URL);
      if (pageIndex) {
         url.searchParams.set('page', pageIndex.toString());
      }
      return url;
   }
}
