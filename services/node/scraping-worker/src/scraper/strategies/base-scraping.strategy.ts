import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';

import { sleep } from '@/common/functions/sleep';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export abstract class BaseScrapingStrategy {
   protected abstract PLATFORM: SupportedPlatform;
   protected abstract logger: Logger;

   private readonly MIN_DELAY = 300;
   private readonly MAX_DELAY = 3000;

   constructor(protected readonly page: Page) {}

   // Produce a random delay between navigations
   protected async delay(): Promise<void> {
      const ms = Math.floor(
         Math.random() * (this.MAX_DELAY - this.MIN_DELAY + 1) + this.MIN_DELAY,
      );
      return sleep(ms);
   }
}
