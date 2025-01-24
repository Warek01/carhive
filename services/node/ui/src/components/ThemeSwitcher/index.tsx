'use client';

import { FC, useCallback, useMemo } from 'react';
import { Box, Button, useColorScheme } from '@mui/material';
import { LightMode, DarkMode, BrightnessAuto } from '@mui/icons-material';

type Mode = 'light' | 'dark' | 'system';

const modeSwitchMap: Record<Mode, Mode> = {
   dark: 'light',
   light: 'system',
   system: 'dark',
};

const modeIconMap: Record<Mode, typeof LightMode> = {
   dark: DarkMode,
   light: LightMode,
   system: BrightnessAuto,
};

const ThemeSwitcher: FC = () => {
   const { mode, setMode } = useColorScheme();

   const handleSwitch = useCallback(() => {
      setMode(modeSwitchMap[mode!]);
   }, [mode]);

   const Icon = useMemo(() => modeIconMap[mode!], [mode]);

   if (!mode) {
      return <Box></Box>;
   }

   return (
      <Button onClick={handleSwitch}>
         <Icon width={32} height={32} />
      </Button>
   );
};

export default ThemeSwitcher;
