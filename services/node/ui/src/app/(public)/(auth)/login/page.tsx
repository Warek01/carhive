'use client';

import { Button, Spinner, TextField } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/hooks/use-auth';
import { LoginDto } from '@/types/auth';
import { authGetRedirectHref } from '@/utils/auth-get-redirect-href';
import { cn } from '@/utils/cn';
import { toastAuthError } from '@/utils/toast-auth-error';

export default function Page() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const auth = useAuth();

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<LoginDto>();

   const onSubmit: SubmitHandler<LoginDto> = async (data) => {
      try {
         await auth.logIn(data);
         router.push(authGetRedirectHref(searchParams));
      } catch (err) {
         toastAuthError(err);
      }
   };

   if (Object.keys(errors).length) {
      console.log(errors);
   }

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className={cn(
            'flex flex-col items-center gap-3',
            isSubmitting && 'pointer-events-none',
         )}
      >
         {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <Spinner />
            </div>
         )}

         <TextField.Root
            {...register('email')}
            required
            placeholder="Email"
            type="email"
            autoComplete="email"
         />
         <TextField.Root
            {...register('password')}
            required
            placeholder="Password"
            type="password"
            autoComplete="current-password"
         />
         <Button type="submit">Login</Button>

         <Link
            href={
               appRoute.register() +
               (searchParams.size ? '?' + searchParams : '')
            }
            className="text-sm"
         >
            Don't have an account?
         </Link>
      </form>
   );
}
