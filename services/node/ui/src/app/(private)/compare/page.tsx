import { Button } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import qs from 'qs';

import { ListingApi } from '@/api';
import {
   ClearComparisonButton,
   ListingDataList,
} from '@/components';
import { PageProps } from '@/types/next';

export default async function Page({ searchParams }: PageProps) {
   const params: any = qs.parse((await searchParams) as any);
   const ids: number[] = params.ids;

   const listingApi = ListingApi.getSingleton();
   const listings = await Promise.all(
      ids.map((id) => listingApi.findListing(id, { includeMetadata: true })),
   );

   return (
      <div>
         <ClearComparisonButton />
         <div className="flex gap-8">
            {listings.map((l) => (
               <div className="flex grow flex-col gap-3" key={l.id}>
                  <div className="relative aspect-video w-full">
                     <Image
                        src={l.images[0]}
                        alt="preview"
                        fill
                        objectPosition="cover"
                     />
                  </div>
                  <ListingDataList
                     listing={l}
                     className="w-full"
                     oneCol={true}
                  />
                  <Button asChild>
                     <Link href={l.metadata!.url}>Go to page</Link>
                  </Button>
               </div>
            ))}
         </div>
      </div>
   );
}
