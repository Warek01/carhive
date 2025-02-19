import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import blur from '@/../public/blur/50x50.webp';
import { ListingApi } from '@/api/listing-api';
import { PageProps } from '@/types/next';

interface Params {
   id: string;
}

export default async function Page({ params }: PageProps<Params>) {
   const { id } = await params;

   if (!/^\d+$/.test(id)) {
      notFound();
   }

   const listingApi = ListingApi.getSingleton();
   const listing = await listingApi.findListing(parseInt(id), {
      includeMetadata: true,
   });

   return (
      <div>
         <p className="text-xl">{listing.title}</p>
         {!!listing.images.length && (
            <div className="relative h-[240px] w-[320px]">
               <Image
                  src={listing.images.at(-1)!}
                  alt="Primary image"
                  placeholder="blur"
                  blurDataURL={blur.blurDataURL}
                  fetchPriority="high"
                  crossOrigin="anonymous"
                  className="object-cover"
                  priority
                  loading="eager"
                  fill
               />
            </div>
         )}
         <Link href={listing.metadata!.url} target="_blank">
            Original link
         </Link>
      </div>
   );
}
