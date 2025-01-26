'use client';

import { BrightnessAuto, DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, useColorScheme } from '@mui/material';
import { FC, useCallback, useMemo } from 'react';

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
      setMode(mode ? modeSwitchMap[mode] : 'system');
   }, [mode]);

   const Icon = useMemo(
      () => (mode ? modeIconMap[mode] : modeIconMap.system),
      [mode],
   );

   return (
      <IconButton onClick={handleSwitch} disabled={!mode}>
         <Icon width={32} height={32} />
      </IconButton>
   );
};

export default ThemeSwitcher;
