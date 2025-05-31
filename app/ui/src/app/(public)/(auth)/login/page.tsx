'use client';

import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import { UserIcon } from 'lucide-react';
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

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className={cn(
            'relative flex w-[268px] flex-col gap-4 p-4 pt-6',
            isSubmitting && 'pointer-events-none',
         )}
      >
         {isSubmitting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-black/30">
               <Spinner />
            </div>
         )}

         <Flex align="center" justify="center" direction="column" gap="1">
            <UserIcon width="24" height="24" />
            <Text size="4" weight="bold">
               Login
            </Text>
         </Flex>

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
         <Button type="submit" className="w-full">
            Login
         </Button>

         <Text as="p" size="1" color="gray" align="center">
            Don't have an account?{' '}
            <Link
               href={
                  appRoute.register() +
                  (searchParams.size ? '?' + searchParams : '')
               }
               className="underline"
            >
               Register
            </Link>
         </Text>
      </form>
   );
}
