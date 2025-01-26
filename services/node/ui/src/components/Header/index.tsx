import { Box, Grid2, Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { ThemeSwitcher } from '@/components';
import { appRoute } from '@/config/app-route';

import MenuButton from './MenuButton';

const Header: FC = () => {
   return (
      <Box sx={{ px: 10, height: 64, py: 2, borderBottom: '1px solid black' }}>
         <Grid2 container>
            <Grid2 size={2}>
               <Link component={NextLink} href={appRoute.home()}>
                  <Typography variant="h5">Carhive</Typography>
               </Link>
            </Grid2>
            <Grid2 size={7} container sx={{ alignItems: 'center' }}>
               <Stack direction="row">
                  <Link component={NextLink} href={appRoute.listing()}>
                     <Typography variant="body1">Listings</Typography>
                  </Link>
               </Stack>
            </Grid2>
            <Grid2 size={3}>
               <Stack direction="row" justifyContent="end">
                  <ThemeSwitcher />
                  <MenuButton />
               </Stack>
            </Grid2>
         </Grid2>
      </Box>
   );
};

export default Header;
