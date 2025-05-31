'use client';

import { Skeleton } from '@radix-ui/themes';
import { useQuery } from 'react-query';

import { ListingApi } from '@/api';
import { ListingList } from '@/components';
import { AppQueryKey } from '@/enums/app-query-key';
import { ListingOrderBy } from '@/enums/listing';

export default function Home() {
   const listingApi = ListingApi.getSingleton();
   const listingQuery = useQuery({
      queryFn: () =>
         listingApi.getListings({
            orderBy: ListingOrderBy.CreatedAtDesc,
            limit: 6,
            offset: 0,
            includeMetadata: false,
         }),
      enabled: true,
      queryKey: [AppQueryKey.Listing],
   });

   return (
      <main>
         <h1 className="my-6 text-4xl font-bold">Welcome to Carhive</h1>
         <h2 className="mb-2 text-xl">Newest listings available:</h2>
         <ListingList
            isLoading={listingQuery.isLoading}
            listings={listingQuery.data?.items ?? []}
            skeletonCount={6}
         />
      </main>
   );
}
