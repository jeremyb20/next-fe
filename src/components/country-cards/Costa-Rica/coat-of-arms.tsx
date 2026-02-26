'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';

export default function CoatOfArms() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
        width: 220,
        height: 200,
        opacity: 0.04,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/assets/images/about/coat-of-arms.svg"
        alt="Escudo de Costa Rica"
        width={220}
        height={200}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}
