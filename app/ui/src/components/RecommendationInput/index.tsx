'use client';

import { Button, TextField } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { UserApi } from '@/api';
import { AppQueryKey } from '@/enums/app-query-key';
import { useAuth } from '@/hooks/use-auth';

interface FormFields {
   preferences: string;
}

export default function RecommendationInput() {
   const { user } = useAuth();
   const userApi = UserApi.getSingleton();
   const queryClient = useQueryClient();

   const {
      register,
      handleSubmit,
      formState: { isLoading },
   } = useForm<FormFields>({
      defaultValues: {
         preferences: user?.preferences ?? '',
      },
   });

   const prefMutation = useMutation({
      mutationFn: (preferences: string) =>
         userApi.update(user!.id, { preferences }),
      onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: AppQueryKey.User,
         });
      },
   });

   const onSubmit = handleSubmit(async ({ preferences }) => {
      await prefMutation.mutateAsync(preferences);
   });

   return (
      <form onSubmit={onSubmit} className="flex items-center gap-3 py-6">
         <label htmlFor="preferences">Your query:</label>
         <TextField.Root
            {...register('preferences')}
            disabled={isLoading}
            id="preferences"
            placeholder="Type here"
            className="w-full max-w-[400px]"
         />
         <Button type="submit" disabled={isLoading}>
            Submit
         </Button>
      </form>
   );
}
