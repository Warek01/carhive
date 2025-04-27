import { AxiosRequestConfig } from 'axios';

import { ApiBase } from '@/api/api-base';
import { Recommendation } from '@/types/recommendation';

export class RecommendationApi extends ApiBase {
   private static singleton: RecommendationApi = null!;

   protected readonly BASE_PATH = 'v1/recommendation';

   static getSingleton(): RecommendationApi {
      RecommendationApi.singleton ??= new RecommendationApi();
      return RecommendationApi.singleton;
   }

   async generate(
      params: string[] | string,
      config?: Partial<AxiosRequestConfig<any>>,
   ): Promise<Recommendation> {
      return this._get('', {
         params: { params },
         ...config,
      });
   }

   async clearCache(): Promise<void> {
      return this._post('clear-cache', {});
   }
}
