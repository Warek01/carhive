import { Link, Typography } from '@mui/material';
import NextLink from 'next/link';

export default async function Page() {
   const LISTING_IDS = Array(10)
      .fill(null)
      .map((_, i) => i);

   return LISTING_IDS.map((id) => (
      <Typography variant="body1" key={id}>
         <Link component={NextLink} href={`/listing/${id}`}>
            Listing {id}
         </Link>
      </Typography>
   ));
}
