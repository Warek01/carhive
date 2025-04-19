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
      <div className="">
         <p className="text-xl">{listing.title}</p>
         <Gallery className="" images={listing.images || []} />
         <ListingDataList listing={listing} />
         {showAddToComparison && (
            <Button onClick={() => cmp.toggle(listing.id)}>
               {cmp.has(listing.id)
                  ? 'Remove from comparison'
                  : 'Add to comparison'}
            </Button>
         )}
         <Link href={listing.metadata!.url} target="_blank">
            Original link
         </Link>
      </div>
   );
}
