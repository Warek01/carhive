import { Card } from '@radix-ui/themes';
import Link from 'next/link';

import { appRoute } from '@/config/app-route';
import { Listing } from '@/types/listing';

export default function Item(l: Listing) {
   return (
      <Card>
         <Link href={appRoute.listingDetails({ id: l.id.toString() })}>
            {l.title}
         </Link>
      </Card>
   );
}
