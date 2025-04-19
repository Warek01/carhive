import { Card, Skeleton } from '@radix-ui/themes';
import { Suspense } from 'react';

import { LayoutProps } from '@/types/next';

export default async function Layout({ children }: LayoutProps) {
   return (
      <div className="flex flex-1 items-center justify-center">
         <Card className="relative p-1">
            <Suspense fallback={<Skeleton width="268" height="156" />}>
               {children}
            </Suspense>
         </Card>
      </div>
   );
}
