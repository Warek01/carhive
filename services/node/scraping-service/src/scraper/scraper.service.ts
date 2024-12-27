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

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
   private readonly logger = new Logger(ScraperService.name);

   private readonly WINDOW_HEIGHT = 720;
   private readonly WINDOW_WIDTH = 1280;

   private readonly DockerLaunchOptions: LaunchOptions = {
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args: [
         '--no-sandbox',
         '--disable-setuid-sandbox',
         '--disable-dev-shm-usage',
         '--disable-accelerated-2d-canvas',
         '--disable-gpu',
      ],
      downloadBehavior: {
         policy: 'deny',
      },
   };

   private readonly LocalLaunchOptions: LaunchOptions = {
      headless: false,
      args: [`--window-size=${this.WINDOW_WIDTH},${this.WINDOW_HEIGHT}`],
      downloadBehavior: {
         policy: 'deny',
      },
   };

   private readonly BlockedResourceTypes: ResourceType[] = [
      'image',
      'font',
      'stylesheet',
   ];

   private readonly StrategyBases: Array<typeof BaseScrapingStrategy> = [
      Scraping999Strategy,
   ];

   private browser: Browser;
   private strategies: BaseScrapingStrategy[];

   constructor(private readonly config: ConfigService<AppEnv>) {}

   async onModuleDestroy(): Promise<void> {
      await this.browser.close();
   }

   async onModuleInit(): Promise<void> {
      this.scheduleChecks();

      const launchOptions: LaunchOptions =
         this.config.get('NODE_ENV') === 'production'
            ? this.DockerLaunchOptions
            : this.LocalLaunchOptions;

      puppeteer
         .use(StealthPlugin())
         .use(
            AdBlockPlugin({
               blockTrackers: true,
               blockTrackersAndAnnoyances: true,
               useCache: true,
            }),
         )
         .use(
            BlockResourcesPlugin({
               blockedTypes: new Set(this.BlockedResourceTypes),
            }),
         )
         .use(AnonymizeUaPlugin());

      this.browser = await puppeteer.launch(launchOptions);
      this.logger.log('Browser launched');

      this.strategies = [];
      for (const StrategyBase of this.StrategyBases) {
         const page = await this.createPage();
         const strategy = new StrategyBase(page);
         this.strategies.push(strategy);
         this.logger.log(`Initialized strategy ${StrategyBase.name}`);
      }

      this.checkNewListings();
   }

   private scheduleChecks(): void {
      // setInterval(() => this.checkNewListings());
   }

   private checkNewListings() {
      for (const strategy of this.strategies) {
         strategy.scrape();
      }
   }

   private async createPage(): Promise<Page> {
      const page = await this.browser.newPage();
      await page.setViewport({
         width: this.WINDOW_WIDTH,
         height: this.WINDOW_HEIGHT,
      });
      return page;
   }
}
