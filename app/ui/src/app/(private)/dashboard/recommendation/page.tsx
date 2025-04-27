'use client';

import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import { RecommendationApi } from '@/api';
import { AppQueryKey } from '@/enums/app-query-key';
import { Button } from '@radix-ui/themes';

export default function DashboardRecommendationPage() {
   const recApi = RecommendationApi.getSingleton();
   const queryClient = useQueryClient();

   const clearCacheMutation = useMutation({
      mutationFn: () => recApi.clearCache(),
      onSuccess: async () => {
         await queryClient.invalidateQueries([AppQueryKey.Recommendation]);
         toast('Cache cleared');
      },
      onError: (error) => {
         toast.error('Something went wrong');
         console.error(error);
      },
   });

   return <main>
      <Button onClick={() => clearCacheMutation.mutateAsync()}>
         Clear cache
      </Button>
   </main>;
}
