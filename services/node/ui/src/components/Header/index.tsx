import { FC } from 'react';
import { Box, Link, Stack, Grid2, Typography } from '@mui/material';
import NextLink from 'next/link';

import { appRoute } from '@/config/app-route';
import { ThemeSwitcher } from '@/components';

const Header: FC = () => {
   return (
      <Box sx={{ px: 10, height: 64, py: 2, borderBottom: '1px solid black' }}>
         <Grid2 container>
            <Grid2 size={3}>
               <Link component={NextLink} href={appRoute.home()}>
                  <Typography variant="h5">Carhive</Typography>
               </Link>
            </Grid2>
            <Grid2 size={6} container sx={{ alignItems: 'center' }}>
               <Stack direction="row">
                  <Link component={NextLink} href={appRoute.listing()}>
                     <Typography variant="body1">Listings</Typography>
                  </Link>
               </Stack>
            </Grid2>
            <Grid2 size={3}>
               <ThemeSwitcher />
            </Grid2>
         </Grid2>
      </Box>
   );
};

export default Header;
