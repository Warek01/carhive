'use client';

import { createTheme } from '@mui/material/styles';
import { amber } from '@mui/material/colors';

export const theme = createTheme({
   typography: {
      fontFamily: 'var(--font-roboto)',
   },
   cssVariables: {
      colorSchemeSelector: 'class',
   },
   palette: {
      primary: {
         main: amber[600],
      },
   },
   colorSchemes: {
      light: true,
      dark: true,
   },
   components: {
      MuiLink: {
         defaultProps: {
            underline: 'none',
         },
      },
   },
});
