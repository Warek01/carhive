'use client';

import { Button, Spinner, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { UserApi } from '@/api';
import { AppQueryKey } from '@/enums/app-query-key';
import { useAuth } from '@/hooks/use-auth';

export default function RecommendationInput() {
   const { user } = useAuth();
   const userApi = UserApi.getSingleton();
   const queryClient = useQueryClient();
   const [preferences, setPreferences] = useState('');

   const prefMutation = useMutation({
      mutationFn: (preferences: string) =>
         userApi.update(user!.id, { preferences }),
      onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: AppQueryKey.User,
            exact: false,
         });
      },
   });

   const handleUpdatePreferences = async () => {
      await prefMutation.mutateAsync(preferences);
   };

   return (
      <div>
         <div className="flex max-w-96 gap-3">
            {prefMutation.isLoading ? (
               <div>
                  <Spinner size="3" />
               </div>
            ) : (
               <>
                  <TextField.Root
                     value={preferences}
                     onChange={(e) => setPreferences(e.target.value)}
                     placeholder="Your preferences"
                  />
                  <Button onClick={handleUpdatePreferences}>Submit</Button>
               </>
            )}
         </div>
      </div>
   );
}
