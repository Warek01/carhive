'use client';

import { Login, Logout, ManageAccounts } from '@mui/icons-material';
import {
   Box,
   Divider,
   ListItemIcon,
   ListItemText,
   Menu,
   MenuItem,
   Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { appRoute } from '@/config/app-route';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface Props {
   onClose: () => void;
   open: boolean;
   anchorEl: Element | null;
}

const HeaderMenu: FC<Props> = ({ onClose, anchorEl, open }) => {
   const { unsetUser, authorized, user } = useAuth();

   const handleAuthClick = async () => {
      await unsetUser();
      onClose();
   };

   return (
      <Menu
         onClose={onClose}
         open={open}
         anchorEl={anchorEl}
         sx={{ width: 256 }}
      >
         <Box sx={{ width: 320 }}>
            <MenuItem
               disabled={!authorized}
               component={NextLink}
               href={appRoute.user()}
            >
               <ListItemIcon>
                  <ManageAccounts fontSize="small" />
               </ListItemIcon>
               <ListItemText>
                  <Typography overflow="hidden" textOverflow="ellipsis">
                     {user?.username ?? 'Log in to access'}
                  </Typography>
               </ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleAuthClick}>
               <ListItemIcon>
                  {authorized ? (
                     <Logout fontSize="small" />
                  ) : (
                     <Login fontSize="small" />
                  )}
               </ListItemIcon>
               <ListItemText>Log {authorized ? 'out' : 'in'}</ListItemText>
            </MenuItem>
         </Box>
      </Menu>
   );
};

export default HeaderMenu;
