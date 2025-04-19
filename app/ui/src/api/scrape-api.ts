import { ApiBase } from '@/api/api-base';
import { ScrapingParams } from '@/types/scraping';

export class ScrapeApi extends ApiBase {
   private static singleton: ScrapeApi = null!;

   protected readonly BASE_PATH = 'v1/scraping';

   static getSingleton(): ScrapeApi {
      ScrapeApi.singleton ??= new ScrapeApi();
      return ScrapeApi.singleton;
   }

   scrape(params: ScrapingParams): Promise<void> {
      return this._post('scrape-page', {}, { params });
   }
}
