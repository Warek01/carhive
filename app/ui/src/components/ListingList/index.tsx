import { Listing } from '@/types/listing';

import Item from './Item';

export interface ListingListProps {
   listings: Listing[];
}

export default function ListingList({ listings }: ListingListProps) {
   return (
      <ul className="flex flex-col gap-3">
         {listings.map((l) => (
            <li key={l.id}>
               <Item {...l} />
            </li>
         ))}
      </ul>
   );
}
