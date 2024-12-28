import { Logger } from '@nestjs/common';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export class Scraping999Strategy extends BaseScrapingStrategy {
   protected readonly PAGE_BASE_URL =
      'https://999.md/ro/list/transport/cars?hide_duplicates=yes&sort_type=date_desc&view_type=short';
   protected readonly PLATFORM = SupportedPlatform.TripleNineMd;

   protected readonly logger = new Logger(Scraping999Strategy.name);

   protected async extract(): Promise<string[]> {
      const table = await this.page.$('table.ads-list-table');

      if (!table) {
         this.logger.error('Could not find table element');
         return [];
      }

      return table.$$eval('tbody tr a.js-item-ad', (elements) => {
         return elements.map((e) => e.href);
      });
   }

   protected getPageUrl(pageIndex: number): string {
      return `${this.PAGE_BASE_URL}&page=${pageIndex + 1}`;
   }

   protected async getNrOfPages(): Promise<number> {
      const paginator = await this.page.$('.paginator');

      if (!paginator) {
         return 0;
      }

      const lastPageLi = await paginator.$('li.is-last-page');

      if (lastPageLi) {
         const url = await lastPageLi.$eval('a', (element) => element.href);
         const match = url.match(/page=(\d+)/);
         const num = match?.[1];

         return num ? parseInt(num) : 0;
      }

      const lastNumberedLi = await paginator.$(
         'li:not(.is-next-page):not(.is-last-page):last-of-type',
      );

      return lastNumberedLi?.evaluate((element) =>
         element.textContent ? parseInt(element.textContent) : 0,
      )!;
   }
}
