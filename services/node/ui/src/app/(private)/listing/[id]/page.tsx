import { notFound } from 'next/navigation';

import { ListingApi } from '@/api/listing-api';
import { ListingDetails } from '@/components';
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

   return <ListingDetails listing={listing} showAddToComparison={true} />;
}
