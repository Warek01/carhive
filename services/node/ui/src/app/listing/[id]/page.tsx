import { Box, Link, Typography } from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';

import blur from '@/../public/blur/50x50.webp';
import { ListingApi } from '@/features/listing/api/listing-api';
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
   const listing = await listingApi.findListing(parseInt(id), true);

   return (
      <Box>
         <Typography variant="h3">{listing.title}</Typography>
         {!!listing.images.length && (
            <Box
               sx={{
                  position: 'relative',
                  width: 320,
                  height: 240,
               }}
            >
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
            </Box>
         )}
         <Link
            component={NextLink}
            href={listing.metadata!.url}
            target="_blank"
         >
            Original link
         </Link>
      </Box>
   );
}
