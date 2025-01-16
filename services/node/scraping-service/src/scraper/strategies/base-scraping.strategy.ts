import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError } from 'puppeteer';

import { sleep } from '@/common/functions/sleep';
import { batch } from '@/common/functions/batch';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';
import { ScrapingBatch } from '@/scraper/types/scraping-batch.types';

export abstract class BaseScrapingStrategy {
   protected abstract PAGE_BASE_URL: string;
   protected abstract PLATFORM: SupportedPlatform;
   protected abstract logger: Logger;

   private readonly BATCH_SIZE = 10;
   private readonly MIN_DELAY = 300;
   private readonly MAX_DELAY = 3000;

   constructor(
      protected readonly page: Page,
      private readonly scrapingQueueClient: ClientProxy,
   ) {}

   // Extract the urls from the pages and
   async scrape(startPage?: number, endPage?: number): Promise<void> {
      startPage ??= 1;
      const url = this.getPageUrl(startPage);
      try {
         await this.page.goto(url, {
            waitUntil: 'load',
         });
      } catch (err) {
         if (err instanceof TimeoutError) {
            this.logger.error(`Timeout error to url ${url}`);
            return
         }

         throw err
      }

      endPage ??= await this.getNrOfPages();

      for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
         const urls = await this.extract();
         this.logger.log(
            `${this.PLATFORM} extracted ${currentPage}/${endPage}`,
         );
         const batches = batch(urls, this.BATCH_SIZE);
         this.publishUrls(batches);
         await this.randomDelay();
         await this.page.goto(this.getPageUrl(currentPage + 1), {
            waitUntil: 'load',
         });
      }
   }

   protected abstract getPageUrl(pageIndex: number): string;

   protected abstract getNrOfPages(): Promise<number>;

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
