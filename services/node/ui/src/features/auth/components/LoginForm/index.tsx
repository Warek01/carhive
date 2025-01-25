'use client';

import { FC, useCallback } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

import { LoginDto } from '@/features/auth/types/login';
import { appRoute } from '@/config/app-route';
import { AuthApi } from '@/features/auth/api/auth-api';
import { toastAuthError } from '@/features/auth/utils/toast-auth-error';
import { AppLocalStorageItem } from '@/config/app-local-storage-item';
import { useDetectSessionExpired } from '@/features/auth/hooks/use-detect-session-expired';

const LoginForm: FC = () => {
   useDetectSessionExpired();

   const router = useRouter();

   const handleSubmit = useCallback(
      async (values: LoginDto, formikHelpers: FormikHelpers<LoginDto>) => {
         try {
            const user = await AuthApi.getSingleton().login(values);
            localStorage.setItem(
               AppLocalStorageItem.AuthenticatedUser,
               JSON.stringify(user),
            );

            router.push(appRoute.home());
         } catch (err) {
            toastAuthError(err);
         }
      },
      [],
   );

   return (
      <Formik
         initialValues={{ email: '', password: '' } as LoginDto}
         onSubmit={handleSubmit}
      >
         {({ isSubmitting }) => (
            <Form>
               <Field placeholder="Email" name="email" type="email" />
               <Field placeholder="Password" name="password" type="password" />
               <Button type="submit">Login</Button>
            </Form>
         )}
      </Formik>
   );
};

export default LoginForm;
