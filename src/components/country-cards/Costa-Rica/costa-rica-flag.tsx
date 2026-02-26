'use client';

import Box from '@mui/material/Box';

interface CostaRicaFlagProps {
  width?: number;
  height?: number;
}

export default function CostaRicaFlag({
  width = 60,
  height = 36,
}: CostaRicaFlagProps) {
  const stripeHeight = height / 5;

  return (
    <Box
      sx={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Blue stripe */}
      <Box sx={{ height: stripeHeight, backgroundColor: '#002B7F' }} />
      {/* White stripe */}
      <Box sx={{ height: stripeHeight, backgroundColor: '#FFFFFF' }} />
      {/* Red stripe (double height) */}
      <Box sx={{ height: stripeHeight * 2, backgroundColor: '#CE1126' }} />
      {/* White stripe */}
      <Box
        sx={{
          height: stripeHeight * 0.5,
          backgroundColor: '#FFFFFF',
          mt: `-${stripeHeight * 0.5}px`,
        }}
      />
    </Box>
  );
}

export function CostaRicaFlagAccurate({
  width = 60,
  height = 36,
}: CostaRicaFlagProps) {
  return (
    <Box
      sx={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: '2px',
        overflow: 'hidden',
        flexShrink: 0,
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
