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
import { ClientProxy } from '@nestjs/microservices';
import fs from 'fs/promises';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { Scraping999Strategy } from '@/scraper/strategies/scraping-999.strategy';
import { AppEnv } from '@/common/types/app-env';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';
import { ScrapePlatformRequestDto } from '@/scraper/dto/request/scrape-platform-request.dto';
import { SCRAPER_QUEUE_TOKEN } from '@/scraper/constants/injection-tokens.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { ListScrape } from '@/scraper/entities/list-scrape.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
   private readonly logger = new Logger(ScraperService.name);

   private readonly WINDOW_HEIGHT = 720;
   private readonly WINDOW_WIDTH = 1280;

   private readonly BLOCKED_RESOURCE_TYPES: ResourceType[] = ['image', 'font'];

   private readonly SCRAPING_STRATEGIES: Record<
      SupportedPlatform,
      new (
         ...args: ConstructorParameters<typeof BaseScrapingStrategy>
      ) => BaseScrapingStrategy
   > = {
      [SupportedPlatform.TripleNineMd]: Scraping999Strategy,
   };

   private browser: Browser;

   constructor(
      private readonly config: ConfigService<AppEnv>,
      @Inject(SCRAPER_QUEUE_TOKEN)
      private readonly scrapingQueueClient: ClientProxy,
      @InjectRepository(ListScrape)
      private readonly listScrapeRepo: Repository<ListScrape>,
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
      const strategy = new ScrapingStrategy(
         page,
         this.scrapingQueueClient,
         this,
      );
      await strategy.scrape(startPage, endPage);
      await page.close();
   }

   async createRecord(
      platform: SupportedPlatform,
      startPage: number,
      endPage: number,
      err?: object,
   ) {
      const record = this.listScrapeRepo.create();
      record.platform = platform;
      record.startPage = startPage;
      record.endPage = endPage;
      record.success = !err;
      record.error = err;
      await this.listScrapeRepo.save(record);
   }

   async onModuleDestroy(): Promise<void> {
      await this.browser.close();
   }

   async onModuleInit(): Promise<void> {
      try {
         await fs.access('/browser-screenshots/');
      } catch {
         await fs.mkdir('/browser-screenshots/');
      }

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
