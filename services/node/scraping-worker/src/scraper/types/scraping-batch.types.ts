import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';

export interface ScrapingBatch {
   platform: SupportedPlatform;
   data: string[];
}
