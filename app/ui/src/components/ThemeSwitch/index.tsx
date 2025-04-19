'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { IconButton } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const modeIconMap: Record<Theme, typeof MoonIcon> = {
   dark: MoonIcon,
   light: SunIcon,
   system: MoonIcon,
};

export default function ThemeSwitch() {
   const { theme, setTheme } = useTheme();
   const [Icon, setIcon] = useState<typeof MoonIcon>(MoonIcon);

   useEffect(() => {
      setIcon(theme ? modeIconMap[theme as Theme] : MoonIcon);
   }, [theme]);

   return (
      <IconButton
         variant="ghost"
         onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      >
         <Icon width={24} height={24} />
      </IconButton>
   );
}
