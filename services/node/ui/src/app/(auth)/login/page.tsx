'use client';

import { Button } from '@radix-ui/themes';
import { Form, Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { AuthApi } from '@/api/auth-api';
import { AppTextField } from '@/components';
import { appRoute } from '@/config/app-route';
import { useDetectSessionExpired } from '@/hooks/use-detect-session-expired';
import { LoginDto } from '@/types/auth';
import { authGetRedirectHref } from '@/utils/auth-get-redirect-href';
import { cn } from '@/utils/cn';
import { toastAuthError } from '@/utils/toast-auth-error';

export default function Page() {
   useDetectSessionExpired();
   const router = useRouter();
   const searchParams = useSearchParams();

   const handleSubmit = useCallback(
      async (values: LoginDto, formikHelpers: FormikHelpers<LoginDto>) => {
         try {
            await AuthApi.getSingleton().login(values);
            router.push(authGetRedirectHref(searchParams));
         } catch (err) {
            toastAuthError(err);
         }
      },
      [],
   );

   return (
      <div className="flex flex-col gap-2">
         <Formik
            initialValues={{ email: '', password: '' } as LoginDto}
            onSubmit={handleSubmit}
         >
            {({ isSubmitting }) => (
               <Form
                  className={cn(
                     'flex flex-col items-center gap-3',
                     isSubmitting && 'pointer-events-none',
                  )}
               >
                  <AppTextField placeholder="Email" name="email" type="email" />
                  <AppTextField
                     placeholder="Password"
                     name="password"
                     type="password"
                  />
                  <Button type="submit">Login</Button>
               </Form>
            )}
         </Formik>
         <Link
            href={
               appRoute.register() +
               (searchParams.size ? '?' + searchParams : '')
            }
            className="text-sm"
         >
            Don't have an account?
         </Link>
      </div>
   );
}
