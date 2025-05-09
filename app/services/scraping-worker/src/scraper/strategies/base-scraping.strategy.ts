import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';

import { CreateListing } from '@/listing/types/listing.types';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export abstract class BaseScrapingStrategy {
   protected abstract PLATFORM: SupportedPlatform;
   protected abstract logger: Logger;

   constructor(protected readonly page: Page) {}

   // Extract the detailed listing data from the page
   public abstract extract(url: string): Promise<CreateListing>;
}
