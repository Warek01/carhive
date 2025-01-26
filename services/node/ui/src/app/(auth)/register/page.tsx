import { Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';

import { appRoute } from '@/config/app-route';
import { RegisterForm } from '@/features/auth/components';

export default async function Page() {
   return (
      <Stack spacing={2}>
         <RegisterForm />
         <Typography textAlign="center" variant="subtitle2">
            <Link component={NextLink} href={appRoute.login()}>
               Already have an account?
            </Link>
         </Typography>
      </Stack>
   );
}
