'use client';

import { Button, Card } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';

import { appRoute } from '@/config/app-route';
import { AuthApi } from '@/features/auth/api/auth-api';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useDetectSessionExpired } from '@/features/auth/hooks/use-detect-session-expired';
import { RegisterDto } from '@/features/auth/types/register';
import { toastAuthError } from '@/features/auth/utils/toast-auth-error';
import { cn } from '@/utils/cn';

const RegisterForm: FC = () => {
   useDetectSessionExpired();
   const { setUser } = useAuth();
   const router = useRouter();

   const handleSubmit = useCallback(
      async (
         values: RegisterDto,
         formikHelpers: FormikHelpers<RegisterDto>,
      ) => {
         try {
            const user = await AuthApi.getSingleton().register(values);
            setUser(user);
            router.push(appRoute.home());
         } catch (err) {
            toastAuthError(err);
         }
      },
      [],
   );

   return (
      <Card elevation={3} sx={{ p: 3 }}>
         <Formik
            initialValues={
               { email: '', password: '', username: '' } as RegisterDto
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
                  <Field placeholder="Email" name="email" type="email" />
                  <Field placeholder="Usename" name="username" type="text" />
                  <Field
                     placeholder="Password"
                     name="password"
                     type="password"
                  />
                  <Field
                     placeholder="Repeat password"
                     name="passwordRepeat"
                     type="password"
                  />
                  <Button type="submit">Register</Button>
               </Form>
            )}
         </Formik>
      </Card>
   );
};

export default RegisterForm;
