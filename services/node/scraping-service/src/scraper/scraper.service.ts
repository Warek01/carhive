import {
   Inject,
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
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';
import { ScrapePlatformRequestDto } from '@/scraper/dto/request/scrape-platform-request.dto';
import { SCRAPER_QUEUE_TOKEN } from '@/scraper/constants/injection-tokens.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
   private readonly logger = new Logger(ScraperService.name);

   private readonly WINDOW_HEIGHT = 720;
   private readonly WINDOW_WIDTH = 1280;

   private readonly DOCKER_LAUNCH_OPTIONS: LaunchOptions = {
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

   private readonly LOCAL_LAUNCH_OPTIONS: LaunchOptions = {
      headless: false,
      args: [`--window-size=${this.WINDOW_WIDTH},${this.WINDOW_HEIGHT}`],
      downloadBehavior: {
         policy: 'deny',
      },
   };

   private readonly BLOCKED_RESOURCE_TYPES: ResourceType[] = [
      'image',
      'font',
      'stylesheet',
   ];

   private readonly SCRAPING_STRATEGIES: Record<
      SupportedPlatform,
      new (page: Page, client: ClientProxy) => BaseScrapingStrategy
   > = {
      [SupportedPlatform.TripleNineMd]: Scraping999Strategy,
   };

   private browser: Browser;

   constructor(
      private readonly config: ConfigService<AppEnv>,
      @Inject(SCRAPER_QUEUE_TOKEN)
      private readonly scrapingQueueClient: ClientProxy,
   ) {}

   async scrapePlatform({
      platform,
      startPage,
      endPage,
   }: ScrapePlatformRequestDto): Promise<void> {
      this.logger.log(
         `Starting scraping ${platform} on pages: ${startPage ?? 'start'}-${endPage ?? 'end'}`,
      );
      const ScrapingStrategy = this.SCRAPING_STRATEGIES[platform];
      const page = await this.createPage();
      const strategy = new ScrapingStrategy(page, this.scrapingQueueClient);
      await strategy.scrape(startPage, endPage);
      await page.close();
   }

   async onModuleDestroy(): Promise<void> {
      await this.browser.close();
   }

   async onModuleInit(): Promise<void> {
      const launchOptions: LaunchOptions =
         this.config.get('NODE_ENV') === 'production'
            ? this.DOCKER_LAUNCH_OPTIONS
            : this.LOCAL_LAUNCH_OPTIONS;

      puppeteer
         .use(StealthPlugin())
         // .use(
         //    AdBlockPlugin({
         //       blockTrackers: true,
         //       blockTrackersAndAnnoyances: true,
         //       useCache: true,
         //    }),
         // )
         // .use(
         //    BlockResourcesPlugin({
         //       blockedTypes: new Set(this.BLOCKED_RESOURCE_TYPES),
         //    }),
         // )
         .use(AnonymizeUaPlugin());

      this.browser = await puppeteer.launch(launchOptions);
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
}
