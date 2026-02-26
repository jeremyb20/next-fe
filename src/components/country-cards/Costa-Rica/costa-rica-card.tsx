'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import CoatOfArms from '@/components/country-cards/Costa-Rica/coat-of-arms';
import { CostaRicaFlagAccurate } from '@/components/country-cards/Costa-Rica/costa-rica-flag';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Stack, useTheme, useMediaQuery } from '@mui/material';

interface Props {
  data: IPetProfile | undefined;
}

export default function CostaRicaIDCard({ data }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        <Icon
          icon="twemoji:flag-costa-rica"
          width={28}
          style={{ verticalAlign: 'middle', marginRight: 8 }}
        />
        Cedula de Identidad - Costa Rica
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: '#8a9ab0',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Icon icon="mdi:information-outline" width={14} />
        Este es un diseno de referencia. No es un documento oficial.
      </Typography>

      {/* Card Container */}
      <Paper
        elevation={8}
        sx={{
          width: { xs: '100%', sm: 580, md: 480 },
          maxWidth: 580,
          aspectRatio: {
            xs: '100vw',
            sm: '84 / 54',
          },
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: 'url("/assets/background/costa-rica-id-bg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '3px solid #b8d4e8',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        {/* Coat of Arms watermark */}
        <CoatOfArms />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: { xs: 1, sm: 2.5, md: 3 },
            height: '100%',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: isMobile ? 1 : 1.5,
              mb: 1,
            }}
          >
            <CostaRicaFlagAccurate
              width={isMobile ? 35 : 50}
              height={isMobile ? 25 : 40}
            />
            <Stack alignItems="end">
              <Typography
                sx={{
                  fontSize: { xs: 12, sm: 16 },
                  fontWeight: 800,
                  color: '#1a2a3a',
                  letterSpacing: 1.5,
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                  fontFamily: 'serif',
                }}
              >
                Republica de Costa Rica
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 9, sm: 11 },
                  color: '#3a5a7a',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  lineHeight: 1.3,
                }}
              >
                Tribunal Supremo de Mascotas
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 9, sm: 12 },
                  color: '#1a3a5c',
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  lineHeight: 1.3,
                }}
              >
                Cédula de Identidad
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: 'rgba(26,58,92,0.15)', mb: 1.5 }} />

          {/* Body */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            {/* Left - Data Fields */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.8,
              }}
            >
              {/* Braille-like dots decoration */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  mb: 0.5,
                  flexWrap: 'wrap',
                  maxWidth: 80,
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      bgcolor: 'rgba(26,58,92,0.2)',
                    }}
                  />
                ))}
              </Box>

              <DataField label="Nombre" value={data?.petName || ''} />
              <DataField
                label="1° Apellido"
                value={data?.petFirstSurname || 'N/A'}
              />
              <DataField
                label="2° Apellido"
                value={data?.petSecondSurname || 'N/A'}
              />
              <DataField label="C.C" value={data?.memberPetId || ''} />
            </Box>

            {/* Right - Photo */}
            <Box
              sx={{
                width: { xs: 120, sm: 150 },
                height: { xs: 140, sm: 170 },
                borderRadius: '12px',
                bgcolor: data?.photo ? 'transparent' : 'rgba(100,120,140,0.25)',
                border: data?.photo
                  ? '2px solid rgba(26,58,92,0.25)'
                  : '2px solid rgba(26,58,92,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backdropFilter: 'blur(4px)',
                gap: 1,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {data?.photo ? (
                // Mostrar foto si existe
                <>
                  <Box
                    component="img"
                    src={data.photo}
                    alt={data.petName || 'Foto de mascota'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  />
                  {/* Overlay con texto "FOTO" */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      fontSize: 8,
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      bgcolor: 'rgba(26,58,92,0.5)',
                      px: 0.5,
                      borderRadius: '4px',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    FOTO
                  </Typography>
                </>
              ) : (
                // Mostrar placeholder si no hay foto
                <>
                  <Iconify
                    icon="mdi:account-outline"
                    width={48}
                    color="rgba(26,58,92,0.35)"
                  />
                  <Typography
                    sx={{
                      fontSize: 9,
                      color: 'rgba(26,58,92,0.4)',
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    FOTO
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <Stack
            direction="row"
            justifyContent={data?.photo ? 'space-between' : 'flex-end'}
            alignItems="center"
            sx={{
              opacity: 0.2,
            }}
          >
            {data?.photo && (
              <Box
                sx={{
                  width: { xs: 30, sm: 30 },
                  height: { xs: 30, sm: 30 },
                  borderRadius: '12px',
                  bgcolor: data?.photo
                    ? 'transparent'
                    : 'rgba(100,120,140,0.25)',
                }}
              >
                <Box
                  component="img"
                  src={data.photo}
                  alt={data.petName || 'Foto de mascota'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
            <CostaRicaFlagAccurate width={36} height={22} />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline' }}>
      <Typography
        sx={{
          fontSize: { xs: 10, sm: 12 },
          fontWeight: 700,
          color: '#1a3a5c',
          minWidth: { xs: 70, sm: 85 },
          fontFamily: 'serif',
        }}
      >
        {label}:
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 10, sm: 12 },
          color: '#2a4a6a',
          fontWeight: 500,
          borderBottom: '1px dotted rgba(26,58,92,0.3)',
          flex: 1,
          minHeight: 16,
          lineHeight: '16px',
        }}
      >
        {value || '\u00A0'}
      </Typography>
    </Box>
  );
}
