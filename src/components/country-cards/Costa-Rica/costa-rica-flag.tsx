'use client';

import Box from '@mui/material/Box';
import { Theme, SxProps } from '@mui/material/styles';

interface CostaRicaFlagProps {
  sx?: SxProps<Theme>; // Usar el tipo de MUI para sx
  width?: number | string;
  height?: number | string;
}

export default function CostaRicaFlag({ sx, width, height }: CostaRicaFlagProps) {
  const stripeHeight = typeof height === 'number' ? height / 5 : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        flexShrink: 0,
        width,
        height,
        ...sx,
      }}
    >
      {/* Blue stripe */}
      <Box sx={{ height: stripeHeight, backgroundColor: '#002B7F' }} />
      {/* White stripe */}
      <Box sx={{ height: stripeHeight, backgroundColor: '#FFFFFF' }} />
      {/* Red stripe (double height) */}
      <Box sx={{ height: stripeHeight * 2, backgroundColor: '#CE1126' }} />
      {/* White stripe */}
      <Box sx={{ height: stripeHeight, backgroundColor: '#FFFFFF' }} />
    </Box>
  );
}

export function CostaRicaFlagAccurate({
  sx,
  width,
  height,
}: CostaRicaFlagProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: '2px',
        overflow: 'hidden',
        flexShrink: 0,
        width,
        height,
        ...sx, // Spread de sx al final
      }}
    >
      <Box sx={{ flex: 1, backgroundColor: '#002B7F' }} />
      <Box sx={{ flex: 1, backgroundColor: '#FFFFFF' }} />
      <Box sx={{ flex: 2, backgroundColor: '#CE1126' }} />
      <Box sx={{ flex: 1, backgroundColor: '#FFFFFF' }} />
      <Box sx={{ flex: 1, backgroundColor: '#002B7F' }} />
    </Box>
  );
}
