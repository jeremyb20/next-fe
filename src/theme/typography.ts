import { Barlow, Public_Sans } from 'next/font/google';

// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({
  xs,
  sm,
  md,
  lg,
}: {
  xs: number;
  sm: number;
  md: number;
  lg: number;
}) {
  return {
    '@media (min-width:0px)': {
      fontSize: pxToRem(xs),
    },
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

// Función para escalar tamaños de fuente según el factor
export function getScaledTypography(fontSizeScale: number = 1) {
  const scaleFactor = fontSizeScale;

  return {
    fontFamily: primaryFont.style.fontFamily,
    fontSecondaryFamily: secondaryFont.style.fontFamily,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      lineHeight: 80 / 64,
      fontSize: pxToRem(32 * scaleFactor), // Valor base para móviles muy pequeños
      ...responsiveFontSizes({
        xs: 36 * scaleFactor,
        sm: 44 * scaleFactor,
        md: 52 * scaleFactor,
        lg: 64 * scaleFactor,
      }),
    },
    h2: {
      fontWeight: 800,
      lineHeight: 64 / 48,
      fontSize: pxToRem(28 * scaleFactor),
      ...responsiveFontSizes({
        xs: 32 * scaleFactor,
        sm: 36 * scaleFactor,
        md: 40 * scaleFactor,
        lg: 48 * scaleFactor,
      }),
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(22 * scaleFactor),
      ...responsiveFontSizes({
        xs: 24 * scaleFactor,
        sm: 26 * scaleFactor,
        md: 28 * scaleFactor,
        lg: 32 * scaleFactor,
      }),
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(18 * scaleFactor),
      ...responsiveFontSizes({
        xs: 18 * scaleFactor,
        sm: 20 * scaleFactor,
        md: 22 * scaleFactor,
        lg: 24 * scaleFactor,
      }),
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(16 * scaleFactor),
      ...responsiveFontSizes({
        xs: 16 * scaleFactor,
        sm: 17 * scaleFactor,
        md: 18 * scaleFactor,
        lg: 20 * scaleFactor,
      }),
    },
    h6: {
      fontWeight: 700,
      lineHeight: 28 / 18,
      fontSize: pxToRem(15 * scaleFactor),
      ...responsiveFontSizes({
        xs: 15 * scaleFactor,
        sm: 16 * scaleFactor,
        md: 17 * scaleFactor,
        lg: 18 * scaleFactor,
      }),
    },
    subtitle1: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: pxToRem(14 * scaleFactor),
      ...responsiveFontSizes({
        xs: 14 * scaleFactor,
        sm: 15 * scaleFactor,
        md: 15 * scaleFactor,
        lg: 16 * scaleFactor,
      }),
    },
    subtitle2: {
      fontWeight: 600,
      lineHeight: 22 / 14,
      fontSize: pxToRem(13 * scaleFactor),
      ...responsiveFontSizes({
        xs: 13 * scaleFactor,
        sm: 13 * scaleFactor,
        md: 14 * scaleFactor,
        lg: 14 * scaleFactor,
      }),
    },
    body1: {
      lineHeight: 1.5,
      fontSize: pxToRem(14 * scaleFactor),
      ...responsiveFontSizes({
        xs: 14 * scaleFactor,
        sm: 15 * scaleFactor,
        md: 15 * scaleFactor,
        lg: 16 * scaleFactor,
      }),
    },
    body2: {
      lineHeight: 22 / 14,
      fontSize: pxToRem(13 * scaleFactor),
      ...responsiveFontSizes({
        xs: 13 * scaleFactor,
        sm: 13 * scaleFactor,
        md: 14 * scaleFactor,
        lg: 14 * scaleFactor,
      }),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: pxToRem(11 * scaleFactor),
      ...responsiveFontSizes({
        xs: 11 * scaleFactor,
        sm: 11 * scaleFactor,
        md: 12 * scaleFactor,
        lg: 12 * scaleFactor,
      }),
    },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(11 * scaleFactor),
      ...responsiveFontSizes({
        xs: 11 * scaleFactor,
        sm: 11 * scaleFactor,
        md: 12 * scaleFactor,
        lg: 12 * scaleFactor,
      }),
      textTransform: 'uppercase',
    },
    button: {
      fontWeight: 700,
      lineHeight: 24 / 14,
      fontSize: pxToRem(13 * scaleFactor),
      ...responsiveFontSizes({
        xs: 13 * scaleFactor,
        sm: 13 * scaleFactor,
        md: 14 * scaleFactor,
        lg: 14 * scaleFactor,
      }),
      textTransform: 'unset',
    },
    inputLabel: {
      fontWeight: 500,
      lineHeight: 1.5,
      fontSize: pxToRem(14 * scaleFactor),
      ...responsiveFontSizes({
        xs: 14 * scaleFactor,
        sm: 15 * scaleFactor,
        md: 15 * scaleFactor,
        lg: 16 * scaleFactor,
      }),
    },
    menuItem: {
      fontWeight: 500,
      lineHeight: 1.6,
      fontSize: pxToRem(13 * scaleFactor),
      ...responsiveFontSizes({
        xs: 13 * scaleFactor,
        sm: 13 * scaleFactor,
        md: 14 * scaleFactor,
        lg: 14 * scaleFactor,
      }),
    },
    label: {
      fontWeight: 500,
      lineHeight: 1.6,
      fontSize: pxToRem(13 * scaleFactor),
      ...responsiveFontSizes({
        xs: 13 * scaleFactor,
        sm: 13 * scaleFactor,
        md: 14 * scaleFactor,
        lg: 14 * scaleFactor,
      }),
    },
    span: {
      fontWeight: 500,
      lineHeight: 1.6,
      fontSize: pxToRem(13 * scaleFactor),
      ...responsiveFontSizes({
        xs: 13 * scaleFactor,
        sm: 13 * scaleFactor,
        md: 14 * scaleFactor,
        lg: 14 * scaleFactor,
      }),
    },
  } as const;
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
}

export const primaryFont = Public_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const secondaryFont = Barlow({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Tipografía por defecto (sin escala) - mantén esta exportación para compatibilidad
export const typography = getScaledTypography(1);
