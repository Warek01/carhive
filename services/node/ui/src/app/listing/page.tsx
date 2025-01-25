import { Box, Link, Stack } from '@mui/material';
import NextLink from 'next/link';

import { ListingApi } from '@/features/listing/api/listing-api';
import { appRoute } from '@/config/app-route';

export default async function Page() {
   const listings = await ListingApi.getSingleton().getListings({
      limit: 10,
      offset: 0,
   });

   return (
      <Stack>
         {listings.items.map((l) => (
            <Box key={l.id}>
               <Link
                  href={appRoute.listingDetails({ id: l.id.toString() })}
                  component={NextLink}
               >
                  {l.title}
               </Link>
            </Box>
         ))}
      </Stack>
   );
}
