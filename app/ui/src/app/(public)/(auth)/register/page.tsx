'use client';

import { Button, TextField } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/hooks/use-auth';
import { RegisterDto } from '@/types/auth';
import { authGetRedirectHref } from '@/utils/auth-get-redirect-href';
import { cn } from '@/utils/cn';
import { toastAuthError } from '@/utils/toast-auth-error';

interface FormValues extends RegisterDto {
   passwordRepeat: string;
}

export default function Page() {
   const auth = useAuth();
   const router = useRouter();
   const searchParams = useSearchParams();

   const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
   } = useForm<FormValues>({});

   const onSubmit = handleSubmit(async (values) => {
      try {
         await auth.register(values);
         router.push(authGetRedirectHref(searchParams));
      } catch (err) {
         toastAuthError(err);
      }
   });

   return (
      <div className="flex flex-col gap-2">
         <form
            onSubmit={onSubmit}
            className={cn(
               'flex flex-col items-center gap-3',
               isSubmitting && 'pointer-events-none',
            )}
         >
            <TextField.Root
               {...register('email')}
               placeholder="Email"
               type="email"
            />
            <TextField.Root
               {...register('username')}
               placeholder="Usename"
               type="text"
            />
            <TextField.Root
               {...register('password')}
               placeholder="Password"
               type="password"
            />
            <TextField.Root
               {...register('passwordRepeat')}
               placeholder="Repeat password"
               type="password"
            />
            <Button type="submit">Register</Button>
         </form>
         <Link href={appRoute.login()} className="text-sm">
            Already have an account?
         </Link>
      </div>
   );
}
