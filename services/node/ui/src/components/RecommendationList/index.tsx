'use client';

import { Spinner } from '@radix-ui/themes';
import { useQuery } from 'react-query';
import { useImmer } from 'use-immer';

import { ListingApi, RecommendationApi } from '@/api';
import { ListingList } from '@/components';
import { AppQueryKey } from '@/enums/app-query-key';
import { ListingOrderBy } from '@/enums/listing';
import { useAuth } from '@/hooks/use-auth';
import { ListingGetParams } from '@/types/listing';

export default function RecommendationList() {
   const { user } = useAuth();
   const listingApi = ListingApi.getSingleton();
   const recommendationApi = RecommendationApi.getSingleton();
   const [listingParams, setListingParams] = useImmer<ListingGetParams>({
      orderBy: ListingOrderBy.CreatedAtAsc,
      includeMetadata: false,
      offset: 0,
      limit: 100,
   });

   const recQuery = useQuery({
      queryFn: () => recommendationApi.generate(user!.preferences!),
      enabled: !!user?.preferences,
      queryKey: [
         AppQueryKey.User,
         AppQueryKey.Recommendation,
         user?.preferences,
      ],
      onSuccess: (data) => {
         setListingParams((p) => {
            p.brands = data.cars!.map((c) => c.brand);
            p.models = data.cars!.map((c) => c.model)!;
         });
      },
   });

   const listingQuery = useQuery({
      queryFn: () => listingApi.getListings(listingParams),
      queryKey: [
         AppQueryKey.User,
         AppQueryKey.Listing,
         AppQueryKey.RecommendationListing,
         user?.preferences,
      ],
      enabled: recQuery.isSuccess,
   });

   return (
      <div>
         <h1>Your recommendations for "{user?.preferences}"</h1>
         {(recQuery.isLoading || listingQuery.isLoading) && (
            <Spinner size="3" />
         )}
         {listingQuery.data && (
            <ListingList listings={listingQuery.data.items} />
         )}
      </div>
   );
}
