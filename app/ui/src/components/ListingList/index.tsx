import { Listing } from '@/types/listing';

import Item from './Item';

export interface ListingListProps {
   listings: Listing[];
}

export default function ListingList({ listings }: ListingListProps) {
   return (
      <ul className="grid grid-cols-12 gap-6">
         {listings.map((l) => (
            <li
               key={l.id}
               className="col-span-12 h-fit sm:col-span-6 md:col-span-4 lg:col-span-3 relative"
            >
               <Item listing={l} />
            </li>
         ))}
      </ul>
   );
}
