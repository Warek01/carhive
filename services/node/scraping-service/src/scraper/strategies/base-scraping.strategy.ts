import { Page } from 'puppeteer';

export class BaseScrapingStrategy {
   protected readonly BATCH_SIZE = 5;

   protected readonly page: Page;

   constructor(page: Page) {
      this.page = page;
   }

   public async scrape(): Promise<void> {
      throw new Error('Not implemented');
   }
}
