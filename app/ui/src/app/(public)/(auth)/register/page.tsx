'use client';

import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import { UserPlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
      formState: { isSubmitting },
   } = useForm<FormValues>();

   const onSubmit = handleSubmit(async (values) => {
      try {
         await auth.register(values);
         toast('You are now registered');
         router.push(authGetRedirectHref(searchParams));
      } catch (err) {
         toastAuthError(err);
      }
   });

   return (
      <form
         onSubmit={onSubmit}
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
            <UserPlusIcon width="24" height="24" />
            <Text size="4" weight="bold">
               Register
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
            {...register('username')}
            required
            placeholder="Username"
            type="text"
            autoComplete="username"
         />
         <TextField.Root
            {...register('password')}
            required
            placeholder="Password"
            type="password"
            autoComplete="new-password"
         />
         <TextField.Root
            {...register('passwordRepeat')}
            required
            placeholder="Repeat password"
            type="password"
            autoComplete="new-password"
         />

         <Button type="submit" className="w-full">
            Register
         </Button>

         <Text as="p" size="1" color="gray" align="center">
            Already have an account?{' '}
            <Link href={appRoute.login()} className="underline">
               Login
            </Link>
         </Text>
      </form>
   );
}
