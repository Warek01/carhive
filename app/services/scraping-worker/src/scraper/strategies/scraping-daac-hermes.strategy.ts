import { Logger } from '@nestjs/common';
import removeAccents from 'remove-accents';

import { BaseScrapingStrategy } from '@/scraper/strategies/base-scraping.strategy';
import { CreateListing } from '@/listing/types/listing.types';
import {
   BodyStyle,
   Currency,
   Drivetrain,
   FuelType,
   ListingStatus,
   Transmission,
} from '@/listing/enums';
import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export class ScrapingDaacHermesStrategy extends BaseScrapingStrategy {
   protected readonly PLATFORM = SupportedPlatform.DaacHermes;
   protected readonly logger = new Logger(ScrapingDaacHermesStrategy.name);

   public override async extract(url: string): Promise<CreateListing> {
      await this.page.goto(url, { waitUntil: 'load' });
      await this.page.waitForSelector('h1');

      const title = await this.page.$eval('h1', (h1) => h1.textContent!.trim());
      const [brand, model] = title.split(' ');

      const {
         bodyStyle,
         fuelType,
         transmission,
         drivetrain,
         productionYear,
         mileage,
      } = await this.extractParams();

      const { originalId } = await this.extractMetadata(url);
      const { currency, price } = await this.extractPrice();
      const images = await this.extractImages();

      return {
         title,
         brand,
         model,
         bodyStyle,
         fuelType,
         transmission,
         drivetrain,
         productionYear,
         mileage,
         images,
         metadataCreatedAt: new Date().toString(),
         metadataOriginalId: originalId,
         metadataPlatform: this.PLATFORM as any,
         metadataUrl: url,
         price,
         currency,
         listingStatus: ListingStatus.Available,

         metadataAuthor: null,
         carStatus: null,
         color: null,
         description: null,
      };
   }

   private async extractParams() {
      const extracted = {
         bodyStyle: null as null | BodyStyle,
         fuelType: null as null | FuelType,
         transmission: null as null | Transmission,
         drivetrain: null as null | Drivetrain,
         productionYear: null as null | number,
         mileage: null as null | number,
      };

      const keyMap: Record<
         string,
         [keyof typeof extracted, (v: string) => any]
      > = {
         'tip motor': ['fuelType', this.normalizeFuelType],
         'tipul caroseriei': ['bodyStyle', this.normalizeBodyType],
         'cutie de viteze': ['transmission', this.normalizeTransmission],
         'tip tractiune': ['drivetrain', this.normalizeDrivetrain],
         'anul': ['productionYear', this.normalizeInt],
         'kilometraj': ['mileage', this.normalizeInt],
      };

      const paramsWrapper = await this.page.$('div.cd_params_wrap');
      const params = await paramsWrapper!.$$('ul');

      for (const param of params) {
         const [rawKey, rawValue] = await param.$$eval('li', ([k, v]) => [
            k.textContent,
            v.textContent,
         ]);

         const [key, value] = [
            removeAccents(rawKey!.trim().toLowerCase()),
            removeAccents(rawValue!.trim().toLowerCase()),
         ];

         if (key in keyMap) {
            const [extractedKey, transformFn] = keyMap[key];
            extracted[extractedKey] = transformFn(value);
         }
      }

      return extracted;
   }

   private normalizeFuelType(value: string): FuelType | null {
      if (value.includes('benzina')) return FuelType.Gas;
      if (value.includes('diesel')) return FuelType.Diesel;
      if (value.includes('electric')) return FuelType.Electric;
      if (value.includes('hybrid')) return FuelType.Hybrid;

      return null;
   }

   private normalizeDrivetrain(value: string): Drivetrain | null {
      switch (value) {
         case '4x4':
            return Drivetrain.FourWheelDrive;
         case '4x2':
            return Drivetrain.FrontWheelDrive;
         default:
            return null;
      }
   }

   private normalizeBodyType(value: string): BodyStyle | null {
      if (value.includes('universal') || value.includes('wagon'))
         return BodyStyle.Wagon;
      if (value.includes('sedan')) return BodyStyle.Sedan;
      if (value.includes('hatchback')) return BodyStyle.Hatchback;
      if (value.includes('minivan')) return BodyStyle.Minivan;
      if (value.includes('van')) return BodyStyle.Van;

      return null;
   }

   private normalizeTransmission(value: string): Transmission | null {
      switch (value) {
         case 'manuala':
            return Transmission.Manual;
         case 'automata':
            return Transmission.Automatic;

         default:
            return null;
      }
   }

   private normalizeInt(value: string): number | null {
      const parsed = parseInt(value);
      if (isNaN(parsed)) return null;
      return parsed;
   }

   private extractMetadata(url: string) {
      const match = url.match(/\/masina\/([^\/?#]+)/);
      const originalId = match ? match[1] : null;

      return { originalId };
   }

   private async extractPrice() {
      const priceText = await this.page.$eval('div.cd_main_price', (el) => {
         function getLastTextNode(el: HTMLElement) {
            const childNodes = el.childNodes;
            for (let i = childNodes.length - 1; i >= 0; i--) {
               const node = childNodes[i];
               if (
                  node.nodeType === Node.TEXT_NODE &&
                  node.textContent!.trim() !== ''
               ) {
                  return node;
               }
            }
            return null;
         }

         return getLastTextNode(el)?.textContent;
      });

      if (!priceText) {
         return {
            currency: null,
            price: null,
         };
      }

      const lastWord = priceText.match(/\s(?<lw>\w+)$/)?.groups?.lw;

      return {
         currency: lastWord
            ? ({ euro: Currency.Eur, mdl: Currency.Mdl, usd: Currency.Usd }[
                 lastWord
              ] ?? null)
            : null,
         price: this.normalizeInt(priceText),
      };
   }

   private async extractImages() {
      const wrapper = await this.page.$('div.slider_thumbs');

      if (!wrapper) {
         return [];
      }

      return await wrapper.$$eval('img', (imgs) => imgs.map((img) => img.src));
   }
}
