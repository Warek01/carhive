import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';

import { CreateListing } from '@/listing/types/listing.types';
import { Platform } from '@/listing/enums';

export abstract class BaseScrapingStrategy {
   protected abstract PLATFORM: Platform;
   protected abstract logger: Logger;

   constructor(protected readonly page: Page) {}

   // Extract the detailed listing data from the page
   public abstract extract(url: string): Promise<CreateListing>;
}
