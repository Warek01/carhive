import { Platform } from '@/enums/scraping';

export interface ScrapingParams {
   platform: Platform;
   startPage: number;
   endPage: number;
}
