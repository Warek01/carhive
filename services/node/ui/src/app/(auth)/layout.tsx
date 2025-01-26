import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
   return (
      <Box
         sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
         }}
      >
         {children}
      </Box>
   );
}
