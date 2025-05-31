import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';

import { appRoute } from '@/config/app-route';
import { currencyStrMap } from '@/config/listing-mappings';
import { Listing } from '@/types/listing';
import { mediaUrl } from '@/utils/media-url';

interface Props {
   listing: Listing;
}

export default function Item(props: Props) {
   const { listing } = props;

   return (
      <Card className="h-fit w-full">
         <Link href={appRoute.listingDetails({ id: listing.id.toString() })}>
            <div className="relative flex aspect-video h-full items-center justify-center">
               {listing.images.length ? (
                  <Image
                     src={mediaUrl(listing.images[0])}
                     loading="lazy"
                     fetchPriority="auto"
                     alt="preview"
                     sizes="all"
                     fill={true}
                     className="object-cover object-center"
                  />
               ) : (
                  <ExclamationTriangleIcon />
               )}
            </div>
            <p className="pt-2 text-blue-300">{listing.title}</p>
            <p>
               {listing.productionYear && `${listing.productionYear} - `}
               {listing.price}{' '}
               {listing.currency && currencyStrMap[listing.currency]}
            </p>
         </Link>
      </Card>
   );
}
