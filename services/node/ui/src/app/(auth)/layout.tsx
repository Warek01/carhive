import { Card, Skeleton } from '@radix-ui/themes';
import { PropsWithChildren, Suspense } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
   return (
      <div className="flex flex-1 items-center justify-center">
         <Card className="p-1">
            <Suspense fallback={<Skeleton width="268" height="156" />}>
               {children}
            </Suspense>
         </Card>
      </div>
   );
}
