'use client';

import { Badge, Button, Spinner, Text } from '@radix-ui/themes';
import { RefreshCwIcon } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';

import { ListingApi } from '@/api';
import { AppQueryKey } from '@/enums/app-query-key';

export default function DashboardListingPage() {
   const api = ListingApi.getSingleton();
   const queryClient = useQueryClient();

   const countQuery = useQuery({
      queryKey: [AppQueryKey.Listing],
      queryFn: () => api.getCount(),
   });

   const handleRefresh = () => {
      queryClient.invalidateQueries({
         queryKey: [AppQueryKey.Listing],
      });
   };

   const isLoading = countQuery.isLoading || countQuery.isRefetching;

   return (
      <main className="flex flex-col items-start gap-6">
         <section className="flex h-10 flex-row items-center gap-3">
            <Text size="3" weight="medium">
               Total Listings
            </Text>

            <Badge>
               {isLoading ? (
                  <div className="flex h-9 w-10 items-center justify-center">
                     <Spinner size="3" />
                  </div>
               ) : (
                  <Text size="7" weight="bold">
                     {countQuery.data}
                  </Text>
               )}
            </Badge>
         </section>

         <Button onClick={handleRefresh}>
            <RefreshCwIcon size={16} /> Refresh
         </Button>
      </main>
   );
}
