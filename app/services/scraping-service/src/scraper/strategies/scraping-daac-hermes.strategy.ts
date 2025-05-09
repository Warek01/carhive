import { Logger } from '@nestjs/common';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export class ScrapingDaacHermesStrategy extends BaseScrapingStrategy {
   protected readonly PAGE_BASE_URL = 'https://daac-auto.md/ro';
   protected readonly PLATFORM = SupportedPlatform.DaacHermes;

   protected readonly logger = new Logger(ScrapingDaacHermesStrategy.name);

   protected async extract(): Promise<string[]> {
      const list = await this.page.$('div.car_list_area');

      if (!list) {
         this.logger.error('Cars list is not defined');
         return [];
      }

      const selector = `div.col-sm-12.col-md-6.col-lg-4 a[target="_blank"]`;

      const items = await this.page.$$eval(selector, (anchors) =>
         anchors.map((a) => a.href),
      );

      return items;
   }

   protected getPageUrl(pageIndex?: number): URL {
      const url = new URL(this.PAGE_BASE_URL);
      if (pageIndex) {
         url.searchParams.set('page', pageIndex.toString());
      }
      return url;
   }

   protected async waitFn(): Promise<void> {
      await this.page.waitForSelector(
         'div.col-sm-12.col-md-6.col-lg-4 a[target="_blank"]',
      );
   }
}
