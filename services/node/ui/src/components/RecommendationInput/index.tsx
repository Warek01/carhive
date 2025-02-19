'use client';

import { Button, Spinner } from '@radix-ui/themes';
import { Form, Formik, FormikHelpers } from 'formik';
import { useMutation, useQueryClient } from 'react-query';

import { UserApi } from '@/api';
import { AppTextField } from '@/components';
import { AppQueryKey } from '@/enums/app-query-key';
import { useAuth } from '@/hooks/use-auth';

export default function RecommendationInput() {
   const { user } = useAuth();
   const userApi = UserApi.getSingleton();
   const queryClient = useQueryClient();

   const prefMutation = useMutation({
      mutationFn: (preferences: string) =>
         userApi.update(user!.id, { preferences }),
      onSuccess: () => queryClient.invalidateQueries(AppQueryKey.User),
   });

   const handleUpdatePreferences = async (
      {
         preferences,
      }: {
         preferences: string;
      },
      helpers: FormikHelpers<any>,
   ) => {
      prefMutation.mutate(preferences);
      helpers.resetForm();
   };

   return (
      <div>
         <div className="flex max-w-96 gap-3">
            <Formik
               initialValues={{ preferences: '' }}
               onSubmit={handleUpdatePreferences}
            >
               {prefMutation.isLoading ? (
                  <div>
                     <Spinner size="3" />
                  </div>
               ) : (
                  <Form>
                     <AppTextField
                        name="preferences"
                        placeholder="Your preferences"
                     />
                     <Button type="submit">Submit</Button>
                  </Form>
               )}
            </Formik>
         </div>
      </div>
   );
}
