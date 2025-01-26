'use client';

import { Person } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FC, useRef, useState } from 'react';

import HeaderMenu from '@/components/Header/HeaderMenu';

const MenuButton: FC = () => {
   const [isOpen, setIsOpen] = useState(false);
   const anchorRef = useRef<HTMLDivElement>(null);

   const handleClose = () => {
      setIsOpen(false);
   };

   return (
      <div ref={anchorRef}>
         <IconButton onClick={() => setIsOpen((o) => !o)}>
            <Person />
         </IconButton>
         <HeaderMenu
            onClose={handleClose}
            open={isOpen}
            anchorEl={anchorRef.current}
         />
      </div>
   );
};

export default MenuButton;
