'use client';

import { Blockquote, Select } from '@radix-ui/themes';
import { useState } from 'react';
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
   const [generationType, setGenerationType] = useState<'rag' | 'default'>(
      'rag',
   );

   const [listingParams, setListingParams] = useImmer<ListingGetParams>({
      orderBy: ListingOrderBy.CreatedAtAsc,
      includeMetadata: false,
      offset: 0,
      limit: 100,
   });

   const recQuery = useQuery({
      queryFn: () => recommendationApi.generate(user!.preferences!),
      enabled: !!user?.preferences && generationType === 'default',
      queryKey: [
         AppQueryKey.User,
         AppQueryKey.Recommendation,
         user?.preferences,
         'default',
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
      queryKey: [listingParams, 'default'],
      enabled: recQuery.isSuccess && generationType === 'default',
   });

   const ragQuery = useQuery({
      queryFn: () => recommendationApi.generateRag(user!.preferences!),
      enabled: !!user?.preferences && generationType === 'rag',
      queryKey: [
         AppQueryKey.User,
         AppQueryKey.Recommendation,
         user?.preferences,
         'rag',
      ],
   });

   const listings =
      (generationType === 'rag' ? ragQuery.data : listingQuery.data?.items) ??
      [];

   const isLoading =
      ragQuery.isLoading ||
      listingQuery.isLoading ||
      ragQuery.isPlaceholderData ||
      listingQuery.isPlaceholderData ||
      recQuery.isLoading ||
      recQuery.isPlaceholderData;

   return (
      <div>
         <Blockquote>{user?.preferences}</Blockquote>

         <Select.Root
            value={generationType}
            onValueChange={(v) => setGenerationType(v as typeof generationType)}
         >
            <Select.Trigger className="!mt-4" placeholder="Generation type" />
            <Select.Content>
               <Select.Item value="rag">RAG</Select.Item>
               <Select.Item value="default">Default</Select.Item>
            </Select.Content>
         </Select.Root>

         <div className="my-6">
            <ListingList
               isLoading={isLoading}
               skeletonCount={24}
               listings={listings}
            />
         </div>
      </div>
   );
}
