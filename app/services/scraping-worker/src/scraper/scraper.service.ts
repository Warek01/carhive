import {
   Injectable,
   Logger,
   OnModuleDestroy,
   OnModuleInit,
} from '@nestjs/common';
import { Browser, LaunchOptions, Page, ResourceType } from 'puppeteer';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdBlockPlugin from 'puppeteer-extra-plugin-adblocker';
import BlockResourcesPlugin from 'puppeteer-extra-plugin-block-resources';
import AnonymizeUaPlugin from 'puppeteer-extra-plugin-anonymize-ua';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { Scraping999Strategy } from '@/scraper/strategies/scraping-999.strategy';
import { AppEnv } from '@/common/types/app-env';
import { ScrapingBatch } from '@/scraper/types/scraping-batch.types';
import { sleep } from '@/common/functions/sleep';
import { ListingService } from '@/listing/listing.service';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';
import { ScrapingDaacHermesStrategy } from '@/scraper/strategies/scraping-daac-hermes.strategy';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
   private readonly logger = new Logger(ScraperService.name);

   private readonly WINDOW_HEIGHT = 1280;
   private readonly WINDOW_WIDTH = 720;
   private readonly MIN_DELAY = 250;
   private readonly MAX_DELAY = 2000;

   private readonly BLOCKED_RESOURCE_TYPES: ResourceType[] = ['image', 'font'];

   private readonly SCRAPING_STRATEGIES: Partial<
      Record<
         SupportedPlatform,
         new (
            ...args: ConstructorParameters<typeof BaseScrapingStrategy>
         ) => BaseScrapingStrategy
      >
   > = {
      [SupportedPlatform.TripleNineMd]: Scraping999Strategy,
      [SupportedPlatform.DaacHermes]: ScrapingDaacHermesStrategy,
   };

   // Resolves to the browser instance
   private browserPromise: Promise<Browser>;
   private browser: Browser;

   constructor(
      private readonly config: ConfigService<AppEnv>,
      private readonly listingService: ListingService,
   ) {}

   async scrapePlatform(batch: ScrapingBatch): Promise<void> {
      // Wait if browser not initialized yet
      await this.browserPromise;

      this.logger.log(
         `Scraping ${batch.data.length} pages of ${batch.platform}`,
      );
      const page = await this.createPage();
      try {
         const Strategy = this.SCRAPING_STRATEGIES[batch.platform]!;
         const strategy = new Strategy(page);

         for (let i = 0; i < batch.data.length; i++) {
            const url = batch.data[i];
            this.logger.log(
               `Extracting ${url} (${i + 1}/${batch.data.length})`,
            );
            const createDto = await strategy.extract(url);
            const createRes = await this.listingService.createByQueue(createDto);
            this.logger.log(
               `Successfully extracted ${url} (${i + 1}/${batch.data.length})`,
            );
            await this.randomDelay();
         }
      } catch (err) {
         console.error(err);
         this.logger.error(err);
      }

      await page.close();
   }

   async onModuleDestroy(): Promise<void> {
      await this.browser.close();
   }

   async onModuleInit(): Promise<void> {
      puppeteer
         .use(StealthPlugin())
         // .use(
         //    AdBlockPlugin({
         //       blockTrackers: true,
         //       blockTrackersAndAnnoyances: true,
         //       useCache: true,
         //    }),
         // )
         .use(
            BlockResourcesPlugin({
               blockedTypes: new Set(this.BLOCKED_RESOURCE_TYPES),
            }),
         )
         .use(AnonymizeUaPlugin());

      const launchOptions: LaunchOptions = {
         executablePath: '/usr/bin/google-chrome',
         headless: true,
         args: ['--no-sandbox'],
         downloadBehavior: {
            policy: 'deny',
         },
      };

      this.browserPromise = puppeteer.launch(launchOptions);
      this.browser = await this.browserPromise;
      this.logger.log('Browser launched');
   }

   private async createPage(): Promise<Page> {
      const page = await this.browser.newPage();
      await page.setViewport({
         width: this.WINDOW_WIDTH,
         height: this.WINDOW_HEIGHT,
      });
      return page;
   }

   // Produce a random delay between navigations
   private async randomDelay(): Promise<void> {
      const ms = Math.floor(
         Math.random() * (this.MAX_DELAY - this.MIN_DELAY + 1) + this.MIN_DELAY,
      );
      return sleep(ms);
   }
}
