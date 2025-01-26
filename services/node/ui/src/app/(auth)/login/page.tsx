import { Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';

import { appRoute } from '@/config/app-route';
import { LoginForm } from '@/features/auth/components';

export default async function Page() {
   return (
      <Stack spacing={2}>
         <LoginForm />
         <Typography textAlign="center" variant="subtitle2">
            <Link component={NextLink} href={appRoute.register()}>
               Don't have an account?
            </Link>
         </Typography>
      </Stack>
   );
}
