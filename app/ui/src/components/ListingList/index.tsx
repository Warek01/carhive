'use client';

import { Skeleton } from '@radix-ui/themes';
import { useMemo } from 'react';

import { Listing } from '@/types/listing';

import Item from './Item';

export interface ListingListProps {
   listings: Listing[];
   isLoading: boolean;
   skeletonCount: number;
}

export default function ListingList({
   listings,
   skeletonCount,
   isLoading,
}: ListingListProps) {
   const skeletons = useMemo(
      () =>
         Array(skeletonCount)
            .fill(null)
            .map((_, i) => (
               <li
                  key={i}
                  className="col-span-12 h-fit sm:col-span-6 md:col-span-4 lg:col-span-3"
               >
                  <Skeleton width="100%" height="222px" />
               </li>
            )),
      [skeletonCount],
   );

   const listingElements = useMemo(
      () =>
         listings.length ? (
            listings.map((l) => (
               <li
                  key={l.id}
                  className="relative col-span-12 h-fit sm:col-span-6 md:col-span-4 lg:col-span-3"
               >
                  <Item listing={l} />
               </li>
            ))
         ) : (
            <p className="text-xl whitespace-nowrap">Nothing found</p>
         ),
      [listings],
   );

   return (
      <div>
         <ul className="grid grid-cols-12 gap-4">
            {isLoading ? skeletons : listingElements}
         </ul>
      </div>
   );
}
