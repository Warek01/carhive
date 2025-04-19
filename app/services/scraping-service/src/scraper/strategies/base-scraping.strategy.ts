import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { sleep } from '@/common/functions/sleep';
import { batch } from '@/common/functions/batch';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';
import { ScrapingBatch } from '@/scraper/types/scraping-batch.types';
import { ScraperService } from '@/scraper/scraper.service';

export abstract class BaseScrapingStrategy {
   protected abstract PAGE_BASE_URL: string;
   protected abstract PLATFORM: SupportedPlatform;
   protected abstract logger: Logger;

   private readonly BATCH_SIZE = 10;
   private readonly MIN_DELAY = 250;
   private readonly MAX_DELAY = 2000;

   constructor(
      protected readonly page: Page,
      private readonly scrapingQueueClient: ClientProxy,
      protected readonly scraperService: ScraperService,
   ) {}

   // Extract the urls from the pages and
   async scrape(startPage: number, endPage: number): Promise<void> {
      let err: any;

      try {
         const url = this.getPageUrl(startPage);
         await this.page.goto(url.href);
         await this.waitFn();

         await this.page.screenshot({
            path: `/browser-screenshots/${Date.now()}.webp`,
            type: 'webp',
            optimizeForSpeed: true,
         });

         let currentPage = startPage;
         while (currentPage <= endPage) {
            const urls = await this.extract();
            const batches = batch(urls, this.BATCH_SIZE);
            this.publishUrls(batches);

            this.logger.log(
               `${this.PLATFORM} extracted ${currentPage}/${endPage} (${batches.length} batches of ${this.BATCH_SIZE} links)`,
            );

            if (currentPage === endPage) {
               break;
            }

            // Wait and go to next page
            await this.randomDelay();
            const nextPageUrl = this.getPageUrl(currentPage + 1);
            await this.page.goto(nextPageUrl.href, {
               waitUntil: 'load',
            });
         }
      } catch (e) {
         err = e;
         this.logger.error(e);
      }

      await this.scraperService.createRecord(
         this.PLATFORM,
         startPage,
         endPage,
         err,
      );
   }

   protected abstract getPageUrl(pageIndex?: number): URL;

   protected abstract waitFn(): Promise<void>;

   // Publish urls for scrapers
   protected publishUrls(batches: string[][]): void {
      for (const batch of batches) {
         const data: ScrapingBatch = {
            platform: this.PLATFORM,
            data: batch,
         };
         this.scrapingQueueClient.emit('scraping', data);
      }
   }

   // Extract urls from current page
   protected abstract extract(): Promise<string[]>;

   // Produce a random delay between navigations
   protected async randomDelay(): Promise<void> {
      const ms = Math.floor(
         Math.random() * (this.MAX_DELAY - this.MIN_DELAY + 1) + this.MIN_DELAY,
      );
      return sleep(ms);
   }
}
