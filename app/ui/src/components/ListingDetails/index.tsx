'use client';

import { Button } from '@radix-ui/themes';
import Link from 'next/link';

import { Gallery, ListingDataList } from '@/components';
import { useComparison } from '@/hooks/use-comparison';
import { Listing } from '@/types/listing';

interface Props {
   listing: Listing;
   showAddToComparison?: boolean;
}

export default function ListingDetails(props: Props) {
   const { listing, showAddToComparison = false } = props;
   const cmp = useComparison();

   return (
      <article className="flex flex-col gap-6 py-6">
         <h1 className="text-5xl">{listing.title}</h1>

         <div className="flex gap-6">
            <Gallery
               className="h-fit max-w-[800px]"
               images={listing.images || []}
            />
            <ListingDataList className="flex-1" listing={listing} />
         </div>

         <div className="flex items-center gap-3">
            {showAddToComparison && (
               <Button onClick={() => cmp.toggle(listing.id)}>
                  {cmp.has(listing.id)
                     ? 'Remove from comparison'
                     : 'Add to comparison'}
               </Button>
            )}
            {listing.metadata?.platform !== 'carhive' && (
               <Link href={listing.metadata?.url ?? ''} target="_blank">
                  Original link
               </Link>
            )}
         </div>
      </article>
   );
}
