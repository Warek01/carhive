import { ListingApi } from '@/api/listing-api';
import { ListingList } from '@/components';
import { ListingOrderBy } from '@/enums/listing';

export default async function Page() {
   const listings = await ListingApi.getSingleton().getListings({
      limit: 100,
      offset: 0,
      includeMetadata: false,
      orderBy: ListingOrderBy.CreatedAtAsc,
   });

   return (
      <main>
         <ListingList listings={listings.items} />
      </main>
   );
}
