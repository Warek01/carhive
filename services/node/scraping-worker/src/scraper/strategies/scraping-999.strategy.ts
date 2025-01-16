import { Logger } from '@nestjs/common';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import {
   CreateListing,
   CreateListingMetadata,
} from '@/listing/types/listing.types';
import { Currency, Platform } from '@/listing/enums';

export class Scraping999Strategy extends BaseScrapingStrategy {
   protected readonly PLATFORM = Platform.TripleNineMd;
   protected readonly logger = new Logger(Scraping999Strategy.name);

   public override async extract(url: string): Promise<CreateListing> {
      await this.page.goto(url, { waitUntil: 'load' });

      const headerTitle = await this.page.$eval('header.adPage__header', (el) =>
         el.textContent!.trim(),
      );
      const carImageUrls = await this.page.$$eval(
         '#js-ad-photos img',
         (images) => images.map((i) => i.src.replace('320x240', '900x900')),
      );

      let currency: Currency | undefined = undefined;
      const currencyHandle = await this.page.$(
         '.adPage__content__price-feature__prices__price__currency',
      );

      if (currencyHandle) {
         const currencyStr = await currencyHandle.evaluate((el) =>
            el.textContent?.trim().toLowerCase(),
         );
         switch (currencyStr) {
            case '€':
               currency = Currency.Eur;
               break;
            case '$':
               currency = Currency.Usd;
               break;
            case 'lei':
               currency = Currency.Mdl;
               break;
         }
      }

      const metadata = await this.extractMetadata(url);

      return {
         description: headerTitle,
         images: carImageUrls,
         currency,
         metadata,
      };
   }

   private async extractMetadata(url: string): Promise<CreateListingMetadata> {
      const originalId = url.match(/(\d+)(\?.*)?$/)![0];

      return {
         originalId,
         platform: this.PLATFORM,
         createdAt: new Date(),
         url,
      };
   }
}
