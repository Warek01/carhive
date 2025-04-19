import { Platform } from '@/listing/enums';

export interface ScrapingBatch {
   platform: Platform;
   data: string[];
}
