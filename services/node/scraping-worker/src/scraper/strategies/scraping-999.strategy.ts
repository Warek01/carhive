import { Logger } from '@nestjs/common';
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
   Platform,
   Transmission,
} from '@/listing/enums';

export class Scraping999Strategy extends BaseScrapingStrategy {
   protected readonly PLATFORM = Platform.TripleNineMd;
   protected readonly logger = new Logger(Scraping999Strategy.name);

   public override async extract(url: string): Promise<CreateListing> {
      await this.page.goto(url, { waitUntil: 'load' });

      const [title, images, currency, metadata, description, price, features] =
         await Promise.all([
            this.extractTile(),
            this.extractImages(),
            this.extractCurrency(),
            this.extractMetadata(url),
            this.extractDescription(),
            this.extractPrice(),
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
      } = this.getNormalizedDataFromFeatures(features);

      console.log(features);
      console.log(this.getNormalizedDataFromFeatures(features));

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
         metadata,
         description,
         price,
      };
   }

   private getNormalizedDataFromFeatures(features: Record<string, string>) {
      const brand = features['marca'] || null;
      const model = features['modelul'] || null;
      const carStatus = this.normalizeCarStatus(features['stare']);
      const fuelType = this.normalizeFuelType(features['tip combustibil']);
      const productionYear = parseInt(features['anul fabricatiei']) ?? null;
      const drivetrain = this.normalizeDrivetrain(features['tip tractiune']);
      const bodyStyle = this.normalizeBodyStyle(features['tip caroserie']);
      const transmission = this.normalizeTransmission(
         features['cutia de viteze'],
      );
      const color = this.normalizeColor(features['culoarea']);

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
         '.js-feature-list-item.m-value',
         (els) =>
            els.map((el) => [
               el.querySelector('.adPage__content__features__key')!
                  .textContent!,
               el.querySelector('.adPage__content__features__value')!
                  .textContent!,
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

   private async extractPrice(): Promise<number | null> {
      const handle = await this.page.$(
         '.adPage__content__price-feature__prices__price__value',
      );
      return !handle
         ? null
         : await handle.evaluate((el) =>
              el.textContent ? parseInt(el.getAttribute('content')!) : null,
           );
   }

   private async extractDescription(): Promise<string | null> {
      const handle = await this.page.$('.adPage__content__description');
      return !handle
         ? null
         : await handle.evaluate((el) => el.textContent?.trim() || null);
   }

   private async extractTile(): Promise<string> {
      return this.page.$eval('header.adPage__header', (el) =>
         el.textContent!.trim(),
      );
   }

   private async extractImages(): Promise<string[]> {
      return this.page.$$eval('#js-ad-photos img', (images) =>
         images.map((i) => i.src.replace('320x240', '900x900')),
      );
   }

   private async extractCurrency(): Promise<Currency | null> {
      const currencyHandle = await this.page.$(
         '.adPage__content__price-feature__prices__price__currency',
      );

      if (!currencyHandle) {
         return null;
      }

      const currencyStr = await currencyHandle.evaluate((el) =>
         el.textContent?.trim().toLowerCase(),
      );
      switch (currencyStr) {
         case '€':
            return Currency.Eur;
         case '$':
            return Currency.Usd;
         case 'lei':
            return Currency.Mdl;
         default:
            return null;
      }
   }

   private async extractMetadata(url: string): Promise<CreateListingMetadata> {
      const originalId = url.match(/(\d+)(\?.*)?$/)![0];

      const [createdAt, author] = await Promise.all([
         this.extractUpdateDate(),
         this.extractAuthor(),
      ]);

      return {
         originalId,
         createdAt,
         author,
         url,
         platform: this.PLATFORM,
      };
   }

   private async extractAuthor(): Promise<ListingAuthor | null> {
      const urlAndNamePromise = this.page.$eval(
         '.adPage__aside__stats__owner__login',
         (el) => [el.getAttribute('href'), el.textContent!.trim()],
      );

      const [[url, name], phoneNumber] = await Promise.all([
         urlAndNamePromise,
         this.extractPhoneNumber(),
      ]);

      return {
         url,
         name,
         phoneNumber,
      };
   }

   private async extractPhoneNumber(): Promise<string | null> {
      const handle = await this.page.$('.js-phone-number');

      if (!handle) {
         return null;
      }

      return handle.$eval('a', (el) => el.href);
   }

   private async extractUpdateDate(): Promise<Date> {
      const dateStr = await this.page.$eval(
         '.adPage__aside__stats__date',
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
         /Data actualizării:\s*(\d+)\s*(\w+)\.\s*(\d{4}),\s*(\d{2}):(\d{2})/;
      const match = dateStr.match(pattern)!;

      const [_, dayStr, monthStr, yearStr, hourStr, minuteStr] = match;
      const day = parseInt(dayStr);
      const month = monthsMap[monthStr];
      const year = parseInt(yearStr);
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      return new Date(year, month, day, hour, minute);
   }
}
