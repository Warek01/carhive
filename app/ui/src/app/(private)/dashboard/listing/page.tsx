'use client';

import {
   Badge,
   Button,
   SegmentedControl,
   Separator,
   Spinner,
   Text,
} from '@radix-ui/themes';
import { RefreshCwIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { ListingApi } from '@/api';
import { AppQueryKey } from '@/enums/app-query-key';

enum AutoRefreshRate {
   Disabled = 'Disabled',
   OneSecond = '1 s',
   FiveSeconds = '5 s',
   TenSeconds = '10 s',
}

const refreshRateMsMap = {
   [AutoRefreshRate.OneSecond]: 1000,
   [AutoRefreshRate.FiveSeconds]: 5000,
   [AutoRefreshRate.TenSeconds]: 10000,
};

export default function DashboardListingPage() {
   const api = ListingApi.getSingleton();
   const queryClient = useQueryClient();

   const [autoRefreshRate, setAutoRefreshRate] = useState(
      AutoRefreshRate.Disabled,
   );
   const autoRefreshTimeoutRef = useRef<NodeJS.Timeout>(null);

   const countQuery = useQuery({
      queryKey: [AppQueryKey.ListingAdminData],
      queryFn: () => api.getCount(),
   });

   const handleRefresh = () => {
      queryClient.invalidateQueries({
         queryKey: [AppQueryKey.ListingAdminData],
      });
   };

   const isLoading = countQuery.isLoading;

   useEffect(() => {
      const clear = () => {
         if (autoRefreshTimeoutRef.current) {
            clearInterval(autoRefreshTimeoutRef.current);
            autoRefreshTimeoutRef.current = null;
         }
      };

      if (autoRefreshRate === AutoRefreshRate.Disabled) {
         return clear();
      }

      autoRefreshTimeoutRef.current = setInterval(() => {
         queryClient.invalidateQueries({
            queryKey: [AppQueryKey.ListingAdminData],
         });
      }, refreshRateMsMap[autoRefreshRate]);

      return clear;
   }, [autoRefreshRate]);

   return (
      <main className="space-y-6">
         <section className="flex h-10 flex-row items-center gap-3">
            <Text size="3" weight="medium">
               Total Listings
            </Text>

            <Badge>
               {countQuery.data && (
                  <Text
                     size="7"
                     weight="bold"
                     className="flex items-center gap-1"
                  >
                     {countQuery.data}
                  </Text>
               )}
               {isLoading && (
                  <div className="p-2">
                     <Spinner size="3" />
                  </div>
               )}
            </Badge>
         </section>

         <div className="inline-flex items-center gap-3">
            <Text>Auto refresh</Text>
            <SegmentedControl.Root
               value={autoRefreshRate}
               onValueChange={(v: AutoRefreshRate) => setAutoRefreshRate(v)}
            >
               {Object.values(AutoRefreshRate).map((rate) => (
                  <SegmentedControl.Item key={rate} value={rate}>
                     {rate}
                  </SegmentedControl.Item>
               ))}
            </SegmentedControl.Root>
            <Separator orientation="vertical" />
            <Button onClick={handleRefresh}>
               <RefreshCwIcon size={16} /> Refresh
            </Button>
         </div>
      </main>
   );
}
