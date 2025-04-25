import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';

import { appRoute } from '@/config/app-route';
import { Listing } from '@/types/listing';
import { mediaUrl } from '@/utils/media-url';

interface Props {
   listing: Listing;
}

export default function Item(props: Props) {
   const { listing } = props;

   return (
      <Card className="h-fit w-full">
         <div className="relative flex aspect-video h-full items-center justify-center">
            {listing.images.length ? (
               <Image
                  src={mediaUrl(listing.images[0])}
                  loading="lazy"
                  fetchPriority="auto"
                  alt="preview"
                  fill
                  objectPosition="center"
                  objectFit="cover"
               />
            ) : (
               <ExclamationTriangleIcon />
            )}
         </div>
         <p>{listing.title}</p>
         <Link href={appRoute.listingDetails({ id: listing.id.toString() })}>
            {listing.title}
         </Link>
      </Card>
   );
}
