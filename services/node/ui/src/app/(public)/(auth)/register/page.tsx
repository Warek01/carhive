'use client';

import { Button, TextField } from '@radix-ui/themes';
import { Form, Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/hooks/use-auth';
import { RegisterDto } from '@/types/auth';
import { authGetRedirectHref } from '@/utils/auth-get-redirect-href';
import { cn } from '@/utils/cn';
import { toastAuthError } from '@/utils/toast-auth-error';

export default function Page() {
   const { register } = useAuth();
   const router = useRouter();
   const searchParams = useSearchParams();

   const handleSubmit = useCallback(
      async (
         values: RegisterDto,
         formikHelpers: FormikHelpers<RegisterDto>,
      ) => {
         try {
            await register(values);
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
            initialValues={
               {
                  email: '',
                  password: '',
                  username: '',
                  passwordRepeat: '',
               } as RegisterDto
            }
            onSubmit={handleSubmit}
         >
            {({ isSubmitting }) => (
               <Form
                  className={cn(
                     'flex flex-col items-center gap-3',
                     isSubmitting && 'pointer-events-none',
                  )}
               >
                  <TextField.Root
                     placeholder="Email"
                     name="email"
                     type="email"
                  />
                  <TextField.Root
                     placeholder="Usename"
                     name="username"
                     type="text"
                  />
                  <TextField.Root
                     placeholder="Password"
                     name="password"
                     type="password"
                  />
                  <TextField.Root
                     placeholder="Repeat password"
                     name="passwordRepeat"
                     type="password"
                  />
                  <Button type="submit">Register</Button>
               </Form>
            )}
         </Formik>
         <Link href={appRoute.login()} className="text-sm">
            Already have an account?
         </Link>
      </div>
   );
}
