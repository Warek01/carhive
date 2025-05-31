import { Spinner } from '@radix-ui/themes';
import { PropsWithChildren, Suspense } from 'react';

export default function Layout({ children }: PropsWithChildren) {
   return (
      <Suspense
         fallback={
            <div className="flex h-screen w-full items-center justify-center">
               <Spinner size="3" />
            </div>
         }
      >
         {children}
      </Suspense>
   );
}
