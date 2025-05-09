import { Logger } from '@nestjs/common';
import { ElementHandle } from 'puppeteer';
import removeAccents from 'remove-accents';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import {
   CreateListing,
   CreateListingMetadata,
   ListingAuthor,
} from '@/listing/types/listing.types';
import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   Transmission,
} from '@/listing/enums';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export class Scraping999Strategy extends BaseScrapingStrategy {
   protected readonly PLATFORM = SupportedPlatform.TripleNineMd;
   protected readonly logger = new Logger(Scraping999Strategy.name);

   public override async extract(url: string): Promise<CreateListing> {
      await this.page.goto(url, { waitUntil: 'load' });
      await this.page.waitForSelector('h1');

      const [
         title,
         images,
         metadata,
         description,
         [price, currency],
         features,
      ] = await Promise.all([
         this.extractTile(),
         this.extractImages(),
         this.extractMetadata(url),
         this.extractDescription(),
         this.extractPriceAndCurrency(),
         this.extractFeatures(),
      ]);

      const {
         fuelType,
         productionYear,
         model,
         carStatus,
         brand,
         bodyStyle,
         drivetrain,
         transmission,
         color,
         mileage,
      } = this.getNormalizedDataFromFeatures(features);

      return {
         brand,
         model,
         carStatus,
         fuelType,
         productionYear,
         bodyStyle,
         color,
         drivetrain,
         transmission,
         title,
         images,
         currency,
         description,
         price,
         mileage,
         listingStatus: null,
         metadataAuthor: metadata.author,
         metadataCreatedAt: metadata.createdAt,
         metadataPlatform: metadata.platform,
         metadataOriginalId: metadata.originalId,
         metadataUrl: metadata.url,
      };
   }

   private getNormalizedDataFromFeatures(features: Record<string, string>) {
      const brand = features['marca'] || null;
      const model = features['modelul'] || features['model'] || null;
      const carStatus = this.normalizeCarStatus(features['stare']);
      const fuelType = this.normalizeFuelType(features['tip combustibil']);
      const productionYear =
         parseInt(
            features['anul fabricatiei'] || features['an de fabricatie'],
         ) ?? null;
      const drivetrain = this.normalizeDrivetrain(features['tip tractiune']);
      const bodyStyle = this.normalizeBodyStyle(features['tip caroserie']);
      const transmission = this.normalizeTransmission(
         features['cutia de viteze'] ||
            features['cutie de viteze'] ||
            features['cutie de viteza'] ||
            features['cutia de viteza'] ||
            features['transmisie'],
      );
      const color = this.normalizeColor(
         features['culoarea'] || features['culoare'],
      );
      const mileage =
         parseInt(features['rulaj'] || features['rulajul']) ?? null;

      return {
         brand,
         model,
         carStatus,
         fuelType,
         productionYear,
         drivetrain,
         bodyStyle,
         transmission,
         color,
         mileage,
      };
   }

   private normalizeCarStatus(
      value: string | undefined | null,
   ): CarStatus | null {
      if (!value) {
         return null;
      }
      const map: Record<string, CarStatus> = {
         'necesita reparatii': CarStatus.Damaged,
         'cu rulaj': CarStatus.Used,
         'nou': CarStatus.New,
      };
      return map[value] ?? null;
   }

   private normalizeColor(value: string | undefined | null): string | null {
      if (!value) {
         return null;
      }
      const map: Record<string, string> = {
         'negru': 'Black',
         'argintiu': 'Silver',
         'gri': 'Gray',
         'alb': 'White',
         'rosu': 'Red',
         'zmeuriu': 'Raspberry',
         'albastru deschis': 'Light Blue',
         'maro': 'Brown',
         'verde deschis': 'Light Green',
         'oranj': 'Orange',
         'galben': 'Yellow',
         'albastru inchis': 'Dark Blue',
         'bordo': 'Burgundy',
         'verde': 'Green',
         'violet': 'Purple',
         'roz': 'Pink',
         'bej': 'Beige',
         'auriu': 'Gold',
         'hameleon': 'Chameleon',
         'verde inchis': 'Dark Green',
      };
      return map[value] ?? null;
   }

   private normalizeTransmission(
      value: string | undefined | null,
   ): Transmission | null {
      if (!value) {
         return null;
      }
      const map: Record<string, Transmission> = {
         'mecanica': Transmission.Manual,
         'robotizata': Transmission.Automatic,
         'automata': Transmission.Automatic,
         'variator': Transmission.ContinuouslyVariable,
      };
      return map[value] ?? Transmission.Other;
   }

   private normalizeBodyStyle(
      value: string | undefined | null,
   ): BodyStyle | null {
      if (!value) {
         return null;
      }
      const map: Record<string, BodyStyle> = {
         'camioneta': BodyStyle.Van,
         'universal': BodyStyle.Wagon,
         'minivan': BodyStyle.Minivan,
         'suv': BodyStyle.Suv,
         'cabriolet': BodyStyle.Convertible,
         'pickup': BodyStyle.Pickup,
         'coupe': BodyStyle.Coupe,
         'sedan': BodyStyle.Sedan,
         'crossover': BodyStyle.Crossover,
         'hatchback': BodyStyle.Hatchback,
      };
      return map[value] ?? BodyStyle.Other;
   }

   private normalizeDrivetrain(
      value: string | undefined | null,
   ): Drivetrain | null {
      if (!value) {
         return null;
      }
      const map: Record<string, Drivetrain> = {
         'din fata': Drivetrain.FrontWheelDrive,
         'din spate': Drivetrain.ReadWheelDrive,
         '4x4': Drivetrain.FourWheelDrive,
      };
      return map[value] ?? null;
   }

   private normalizeFuelType(
      value: string | undefined | null,
   ): FuelType | null {
      if (!value) {
         return null;
      }
      if (value.startsWith('gaz')) {
         return FuelType.Gas;
      }
      const map: Record<string, FuelType> = {
         'benzina': FuelType.Petrol,
         'diesel': FuelType.Diesel,
         'hybrid': FuelType.Hybrid,
         'plug-in hybrid': FuelType.PluginHybrid,
         'electricitate': FuelType.Electric,
      };
      return map[value] ?? FuelType.Other;
   }

   private async extractFeatures(): Promise<Record<string, string>> {
      const kvMap = await this.page.$$eval(
         'div[data-sentry-component="FeatureGroup"] ul li:has(> span[class ^= "styles_group__value"])',
         (els) =>
            els.map((el) => [
               el.querySelector('span:nth-of-type(1)')!.textContent!,
               el.querySelector('span:nth-of-type(2)')!.textContent!,
            ]),
      );

      const features: Record<string, string> = {};

      for (let [key, value] of kvMap) {
         key = removeAccents(key.toLowerCase().trim());
         value = removeAccents(value.toLowerCase().trim());
         features[key] = value;
      }

      return features;
   }

   private async extractPriceAndCurrency(): Promise<
      [number | null, Currency | null]
   > {
      const handle = await this.page.$('[data-sentry-component="Price"]');
      const price = !handle
         ? null
         : await handle.evaluate((el) =>
              el.textContent
                 ? (parseFloat(el.textContent.replace(' ', '')) ?? null)
                 : null,
           );

      return price ? [price, Currency.Eur] : [null, null];
   }

   private async extractDescription(): Promise<string | null> {
      const handle = await this.page.$(
         'div[data-sentry-component="AdDescription"]',
      );
      return !handle
         ? null
         : await handle.evaluate((el) => el.textContent?.trim() || null);
   }

   private async extractTile(): Promise<string> {
      return this.page.$eval('h1', (el) => el.textContent!.trim());
   }

   private async extractImages(): Promise<string[]> {
      const gallery = await this.page.$(
         'div[data-sentry-component="Carousel"]',
      );

      if (!gallery) {
         return [];
      }

      return gallery.$$eval('div > img', (images) =>
         images.map((i) => i.src.replace('320x240', '900x900')),
      );
   }

   private async extractMetadata(url: string): Promise<CreateListingMetadata> {
      const originalId = url.match(/(?<id>\d+)(\?.*)?$/)!.groups!.id;

      const asideElement = await this.page.$(
         'aside[data-sentry-component="Sidebar"]',
      );

      const [createdAt, author] = await Promise.all([
         this.extractCreateDate(asideElement!),
         this.extractAuthor(asideElement!),
      ]);

      return {
         originalId,
         createdAt,
         author,
         url,
         platform: this.PLATFORM as any,
      };
   }

   private async extractAuthor(
      asideElement: ElementHandle<HTMLElement>,
   ): Promise<ListingAuthor | null> {
      const [url, name] = await asideElement.$eval(
         'div[data-sentry-component="Owner"] a[class ^= "styles_owner__login__"]',
         (a) => [a.getAttribute('href'), a.textContent!.trim()],
      );

      return {
         url,
         name,
      };
   }

   private async extractCreateDate(
      asideElement: ElementHandle<HTMLElement>,
   ): Promise<string> {
      const dateStr = await asideElement.$eval(
         'p[class ^= "styles_date"]',
         (el) => el.textContent!.trim(),
      );

      const monthsMap: Record<string, number> = {
         'ian': 0,
         'feb': 1,
         'mar': 2,
         'apr': 3,
         'mai': 4,
         'iun': 5,
         'iul': 6,
         'aug': 7,
         'sept': 8,
         'oct': 9,
         'nov': 10,
         'dec': 11,
      };

      const pattern =
         /Data (actualizării|publicǎrii):\s*(?<day>\d+)\s*(?<month>\w+)\.\s*(?<year>\d{4}),\s*(?<hour>\d{2}):(?<minute>\d{2})/;

      const g = dateStr.match(pattern)!.groups!;

      const day = parseInt(g.day);
      const month = monthsMap[g.month];
      const year = parseInt(g.year);
      const hour = parseInt(g.hour);
      const minute = parseInt(g.minute);

      return new Date(year, month, day, hour, minute).toISOString();
   }
}
