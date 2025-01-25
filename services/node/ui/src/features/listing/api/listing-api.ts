import { ApiBase } from '@/api/api-base';
import { PaginatedRequest, PaginatedResponse } from '@/types/api';
import { Listing, ListingAuthor } from '@/features/listing/types/listing';

export class ListingApi extends ApiBase {
   private static singleton: ListingApi = null!;

   protected readonly BASE_PATH = 'v1/listing';

   static getSingleton(): ListingApi {
      ListingApi.singleton ??= new ListingApi();
      return ListingApi.singleton;
   }

   async getListings(
      req: PaginatedRequest,
   ): Promise<PaginatedResponse<Listing>> {
      return this.get('', {
         params: req,
      });
   }

   async findListing(id: number, includeMetadata = true): Promise<Listing> {
      return this.get(id.toString(), {
         params: { includeMetadata },
      });
   }
}
