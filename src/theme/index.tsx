'use client';

import { useMemo } from 'react';
import merge from 'lodash/merge';
import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import { useLocales } from '@/locales';
import { useSettingsContext } from '@/components/settings';

// system
import { palette } from './palette';
import { shadows } from './shadows';
// options
import RTL from './options/right-to-left';
import { customShadows } from './custom-shadows';
import { createPresets } from './options/presets';
import { componentsOverrides } from './overrides';
import { getScaledTypography } from './typography'; // Cambia esta importación
import { createContrast } from './options/contrast';
import NextAppDirEmotionCacheProvider from './next-emotion-cache';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { currentLang } = useLocales();
  const settings = useSettingsContext();

  const themeWithLocale = useMemo(() => {
    const presets = createPresets(settings.themeColorPresets);
    const contrast = createContrast(settings.themeContrast, settings.themeMode);
    const scaledTypography = getScaledTypography(settings.fontSizeScale || 1);

    const baseTheme = createTheme({
      palette: {
        ...palette(settings.themeMode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.themeMode),
        ...presets.customShadows,
      },
      direction: settings.themeDirection,
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography: scaledTypography,
      breakpoints: {
        values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1440 },
      },
    } as ThemeOptions);

    baseTheme.components = merge(
      componentsOverrides(baseTheme),
      contrast.components
    );

    return createTheme(baseTheme, currentLang.systemValue);
  }, [
    settings.themeMode,
    settings.themeDirection,
    settings.themeColorPresets,
    settings.themeContrast,
    settings.fontSizeScale,
    currentLang.systemValue,
  ]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <MuiThemeProvider theme={themeWithLocale}>
        <RTL themeDirection={settings.themeDirection}>
          <CssBaseline />
          {children}
        </RTL>
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
