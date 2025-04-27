import { ApiBase } from '@/api/api-base';
import { PaginatedResponse } from '@/types/api';
import {
   CreateListing,
   Listing,
   ListingFindParams,
   ListingGetParams,
} from '@/types/listing';

export class ListingApi extends ApiBase {
   private static singleton: ListingApi = null!;

   protected readonly BASE_PATH = 'v1/listing';

   static getSingleton(): ListingApi {
      ListingApi.singleton ??= new ListingApi();
      return ListingApi.singleton;
   }

   async getListings(
      params: ListingGetParams,
   ): Promise<PaginatedResponse<Listing>> {
      return this._get('', {
         params,
      });
   }

   async findListing(
      id: number,
      params: ListingFindParams = { includeMetadata: true },
   ): Promise<Listing> {
      return this._get(id.toString(), {
         params,
      });
   }

   async create(dto: CreateListing | FormData): Promise<Listing> {
      return this._post('', dto);
   }

   async getCount(): Promise<number> {
      return this._get('count');
   }
}
