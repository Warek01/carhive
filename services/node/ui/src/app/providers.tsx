'use client';

import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from 'react-query';

import { appQueryClient } from '@/config/app-query-client';
import { AuthContextProvider } from '@/context/auth-context';
import { ReactQueryDevtools } from 'react-query/devtools';

export default function Providers({ children }: PropsWithChildren) {
   return (
      <ThemeProvider attribute="class">
         <Theme>
            <Toaster />
            <QueryClientProvider client={appQueryClient}>
               <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
               <AuthContextProvider>{children}</AuthContextProvider>
            </QueryClientProvider>
         </Theme>
      </ThemeProvider>
   );
}
