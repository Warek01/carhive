import { Page } from 'puppeteer';
import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';

import { sleep } from '@/common/functions/sleep';
import { batch } from '@/common/functions/batch';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export abstract class BaseScrapingStrategy {
   protected abstract PAGE_BASE_URL: string;
   protected abstract PLATFORM: SupportedPlatform;
   protected abstract logger: Logger;

   private readonly BATCH_SIZE = 10;
   private readonly MIN_DELAY = 300;
   private readonly MAX_DELAY = 3000;

   constructor(
      protected readonly page: Page,
      private readonly queue: Queue,
   ) {}

   // Extract the urls from the pages and
   async scrape(startPage?: number, endPage?: number): Promise<void> {
      startPage ??= 1;
      await this.page.goto(this.getPageUrl(startPage), { waitUntil: 'load' });
      endPage ??= await this.getNrOfPages();

      for (let currentPage = startPage; currentPage < endPage; currentPage++) {
         const urls = await this.extract();
         this.logger.log(`${this.PLATFORM} extracted ${currentPage}/${endPage}`)
         const batches = batch(urls, this.BATCH_SIZE);
         await this.publishUrls(batches);
         await this.delay();
         await this.page.goto(this.getPageUrl(currentPage + 1), {
            waitUntil: 'load',
         });
      }
   }

   protected abstract getPageUrl(pageIndex: number): string;

   protected abstract getNrOfPages(): Promise<number>;

   // Publish urls for scrapers
   protected async publishUrls(batches: string[][]): Promise<void> {
      const jobs = batches.map((batch) => ({
         name: this.PLATFORM,
         data: { batch },
      }));
      await this.queue.addBulk(jobs);
   }

   // Extract urls from current page
   protected abstract extract(): Promise<string[]>;

   // Produce a random delay between navigations
   protected async delay(): Promise<void> {
      const ms = Math.floor(
         Math.random() * (this.MAX_DELAY - this.MIN_DELAY + 1) + this.MIN_DELAY,
      );
      return sleep(ms);
   }
}
