import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface TypeBackground {
    neutral: string;
  }

  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }

  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// ----------------------------------------------------------------------
// ABI — WARM EARTH PALETTE
// ----------------------------------------------------------------------

export const grey = {
  0: '#FFFFFF',
  100: '#FFF9F5',
  200: '#F8EEE6',
  300: '#EBD8CA',
  400: '#D1B6A3',
  500: '#AA968A',
  600: '#78665D',
  700: '#5C5C5D',
  800: '#342B28',
  900: '#221E1F',
};

// ----------------------------------------------------------------------
// PRIMARY — TERRACOTTA / BURNT ORANGE
// ----------------------------------------------------------------------

export const primary = {
  lighter: '#FBE7DA',
  light: '#DF976E',
  main: '#B24E01',
  dark: '#8A360F',
  darker: '#4A1D15',
  contrastText: '#FFFFFF',
};

// ----------------------------------------------------------------------
// SECONDARY — WARM BROWN
// ----------------------------------------------------------------------

export const secondary = {
  lighter: '#F3DED2',
  light: '#AA674C',
  main: '#743319',
  dark: '#4A1D15',
  darker: '#221E1F',
  contrastText: '#FFFFFF',
};

// ----------------------------------------------------------------------
// INFO — NEUTRAL GRAY
// ----------------------------------------------------------------------

export const info = {
  lighter: '#F0F0F0',
  light: '#A6A6A6',
  main: '#5C5C5D',
  dark: '#454545',
  darker: '#221E1F',
  contrastText: '#FFFFFF',
};

// ----------------------------------------------------------------------
// SUCCESS — MUTED EARTH GREEN
// ----------------------------------------------------------------------

export const success = {
  lighter: '#E5F0E5',
  light: '#8EAD91',
  main: '#47764D',
  dark: '#315A37',
  darker: '#1F3D25',
  contrastText: '#FFFFFF',
};

// ----------------------------------------------------------------------
// WARNING — GOLDEN EARTH
// ----------------------------------------------------------------------

export const warning = {
  lighter: '#FFF0D6',
  light: '#E9B875',
  main: '#B97818',
  dark: '#8A5310',
  darker: '#59350B',
  contrastText: '#221E1F',
};

// ----------------------------------------------------------------------
// ERROR — WARM RED
// ----------------------------------------------------------------------

export const error = {
  lighter: '#FBE5DE',
  light: '#DF876F',
  main: '#B83B2D',
  dark: '#8C261D',
  darker: '#591711',
  contrastText: '#FFFFFF',
};

// ----------------------------------------------------------------------

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

// ----------------------------------------------------------------------

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

// ----------------------------------------------------------------------

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------
// LIGHT / DARK PALETTES
// ----------------------------------------------------------------------

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...base,
    mode: 'light' as const,

    text: {
      primary: '#221E1F',
      secondary: '#5C5C5D',
      disabled: '#AA968A',
    },

    background: {
      paper: '#FFFFFF',
      default: '#FFF9F5',
      neutral: '#F8EEE6',
    },

    action: {
      ...base.action,
      active: '#743319',
    },
  };

  const dark = {
    ...base,
    mode: 'dark' as const,

    text: {
      primary: '#FFF9F5',
      secondary: '#D1B6A3',
      disabled: '#78665D',
    },

    background: {
      paper: '#342B28',
      default: '#221E1F',
      neutral: alpha('#AA674C', 0.16),
    },

    action: {
      ...base.action,
      active: '#DF976E',
    },
  };

  return mode === 'light' ? light : dark;
}
