'use client';

import { Blockquote, Button } from '@radix-ui/themes';
import { ExternalLinkIcon, ListChecksIcon, TrashIcon } from 'lucide-react';
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
         <h1 className="text-5xl font-semibold">{listing.title}</h1>

         <div className="flex flex-wrap gap-6">
            <Gallery
               className="h-fit max-w-[680px] shrink-0"
               images={listing.images || []}
            />
            <ListingDataList oneCol className="shrink-0" listing={listing} />
            {listing.summary && (
               <div className="min-w-[250px] flex-1">
                  <Blockquote>{listing.summary}</Blockquote>
               </div>
            )}
         </div>

         <div className="flex flex-wrap items-center gap-3">
            {showAddToComparison && (
               <Button
                  onClick={() => cmp.toggle(listing.id)}
                  variant="surface"
                  color={cmp.has(listing.id) ? 'red' : undefined}
                  className="gap-2"
               >
                  {cmp.has(listing.id) ? (
                     <>
                        <TrashIcon size={16} /> Remove from comparison
                     </>
                  ) : (
                     <>
                        <ListChecksIcon size={16} /> Add to comparison
                     </>
                  )}
               </Button>
            )}
            {listing.metadata?.platform !== 'carhive' && (
               <Button asChild variant="soft">
                  <Link
                     href={listing.metadata?.url ?? ''}
                     target="_blank"
                     className="inline-flex items-center gap-1.5"
                  >
                     <ExternalLinkIcon size={16} />
                     Original link
                  </Link>
               </Button>
            )}
         </div>
      </article>
   );
}
