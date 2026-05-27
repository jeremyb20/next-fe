import { useTheme } from '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';

import { useWidth } from '@/hooks/use-responsive';

// ----------------------------------------------------------------------

function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

// Usa el tipo de variante de TypographyProps
type Variant = TypographyProps['variant'];

export default function useTypography(variant: Variant) {
  const theme = useTheme();

  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === 'xl' ? 'lg' : breakpoints);

  // Asegurarnos de que variant no sea undefined o inherit
  if (!variant || variant === 'inherit') {
    return { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0 };
  }

  const hasResponsive =
    variant === 'h1' ||
    variant === 'h2' ||
    variant === 'h3' ||
    variant === 'h4' ||
    variant === 'h5' ||
    variant === 'h6';

  const typographyVariant = (theme.typography as any)[variant];
  const getFont: any =
    hasResponsive && typographyVariant[key]
      ? typographyVariant[key]
      : typographyVariant;

  const fontSize = remToPx(getFont.fontSize);

  const lineHeight = Number(typographyVariant.lineHeight) * fontSize;

  const { fontWeight, letterSpacing } = typographyVariant;

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}
