import { Platform } from '@/enums/scraping';

export interface ScrapingParams {
   platform: Platform;
   startPage: number;
   endPage: number;
}

export interface ScrapeRecord {
   id: number;
   platform: Platform;
   startPage?: number;
   endPage?: number;
   success: boolean;
   error?: any;
   createdAt: string;
}
