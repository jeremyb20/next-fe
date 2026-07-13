import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

import { IPetProfile } from '@/types/api';
import Iconify from '@/components/iconify';
import { PHONE_SUPPORT } from '@/config-global';
import { useTranslation } from '@/hooks/use-translation';
interface Props {
  petProfile: IPetProfile;
  handleShareOpen: () => void;
}
export default function LostPetReport({ petProfile, handleShareOpen }: Props) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          border: '3px solid',
          borderColor: 'warning.main',
          borderRadius: 3,
          bgcolor: (th) =>
            th.palette.mode === 'dark'
              ? 'rgba(255, 171, 0, 0.05)'
              : 'warning.lighter',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: (th) =>
            th.palette.mode === 'dark'
              ? '0 4px 20px rgba(255, 171, 0, 0.15)'
              : '0 4px 20px rgba(255, 171, 0, 0.2)',
        }}
      >
        {/* Fondo decorativo con huellas */}
        <Box
          sx={{
            position: 'absolute',
            right: -30,
            top: -30,
            opacity: 0.06,
            transform: 'rotate(20deg)',
            pointerEvents: 'none',
          }}
        >
          <Iconify icon="mdi:paw" width={160} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: -20,
            bottom: -20,
            opacity: 0.05,
            transform: 'rotate(-15deg)',
            pointerEvents: 'none',
          }}
        >
          <Iconify icon="mdi:paw" width={120} />
        </Box>

        {/* Banner principal - LOST */}
        <Box
          sx={{
            bgcolor: 'warning.main',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 4px 12px rgba(255, 171, 0, 0.3)',
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '50%',
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <Iconify
              icon="solar:magnifer-linear"
              width={32}
              sx={{ color: 'warning.main' }}
            />
          </Box>
          <Stack spacing={0} alignItems="center">
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                color: 'white',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              🆘 {t('LOST PET')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
              }}
            >
              {t('Help us find {{name}}', {
                name: petProfile.petName,
              })}
            </Typography>
          </Stack>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              p: 1,
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            <Iconify icon="mdi:alert" width={24} sx={{ color: 'white' }} />
          </Box>
        </Box>

        {/* Contenido del cartel */}
        <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
          {/* Fecha de pérdida destacada */}
          {/* Botón para compartir el cartel */}
          <Button
            variant="contained"
            fullWidth
            color="warning"
            startIcon={<Iconify icon="mdi:share-variant" />}
            sx={{
              alignSelf: 'center',
              px: 4,
              bgcolor: 'warning.main',
              '&:hover': { bgcolor: 'warning.dark' },
            }}
            onClick={handleShareOpen}
          >
            {t('Share Lost Pet Alert')}
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.light',
            }}
          >
            <Box
              sx={{
                bgcolor: 'warning.light',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 40,
              }}
            >
              <Iconify
                icon="mdi:calendar-alert"
                width={24}
                sx={{ color: 'warning.dark' }}
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {t('Date Lost')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {petProfile.petStatusReport.lostDate
                  ? new Date(
                      petProfile.petStatusReport.lostDate
                    ).toLocaleDateString('es-CR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : t('Not specified')}
              </Typography>
            </Box>
          </Box>

          {/* Ubicación */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.light',
            }}
          >
            <Box
              sx={{
                bgcolor: 'warning.light',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 40,
              }}
            >
              <Iconify
                icon="mdi:map-marker-alert"
                width={24}
                sx={{ color: 'warning.dark' }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {t('Last Seen Location')}
              </Typography>
              <Typography variant="body1">
                {petProfile.petStatusReport.lastSeenLocation ||
                  t('Not specified')}
              </Typography>
            </Box>
          </Box>

          {/* Descripción */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.light',
            }}
          >
            <Box
              sx={{
                bgcolor: 'warning.light',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 40,
              }}
            >
              <Iconify
                icon="mdi:information"
                width={24}
                sx={{ color: 'warning.dark' }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {t('Description & Circumstances')}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {petProfile.petStatusReport.lostDescription ||
                  t('No description provided')}
              </Typography>
            </Box>
          </Box>

          {/* Grid de información adicional */}
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              sm: '1fr 1fr',
            }}
            gap={2}
          >
            {/* Recompensa */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'warning.light',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'success.light',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 40,
                }}
              >
                <Iconify
                  icon="mdi:cash"
                  width={24}
                  sx={{ color: 'success.dark' }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {t('Reward')}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="success.dark"
                >
                  {petProfile.petStatusReport.rewardAmount
                    ? `₡${petProfile.petStatusReport.rewardAmount}`
                    : t('No reward specified')}
                </Typography>
              </Box>
            </Box>

            {/* Microchip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'warning.light',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'info.light',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 40,
                }}
              >
                <Iconify
                  icon="mdi:chip"
                  width={24}
                  sx={{ color: 'info.dark' }}
                />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  component="div" // 🔥 Cambiar a div para evitar anidación incorrecta
                >
                  {t('Microchip')}
                </Typography>
                <Box component="div" sx={{ mt: 0.5 }}>
                  {petProfile.petStatusReport.isMicrochipped ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify
                        icon="mdi:check-circle"
                        width={18}
                        sx={{ color: 'success.main' }}
                      />
                      <Typography variant="body1" component="span">
                        {petProfile.petStatusReport.microchipNumber || t('Yes')}
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify
                        icon="mdi:close-circle"
                        width={18}
                        sx={{ color: 'error.main' }}
                      />
                      <Typography variant="body1" component="span">
                        {t('No')}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Badge de contacto de emergencia */}
          <Box
            sx={{
              bgcolor: 'error.light',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              border: '1px dashed',
              borderColor: 'error.main',
              flexWrap: 'wrap',
            }}
          >
            <Iconify
              icon="mdi:phone-ring"
              width={20}
              sx={{ color: 'error.dark' }}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              color="error.dark"
              textAlign="center"
            >
              {t(
                'If you have any information, please contact the owner immediately'
              )}
            </Typography>
            <Iconify
              icon="mdi:phone-ring"
              width={20}
              sx={{ color: 'error.dark' }}
            />
          </Box>

          {/* abrir whatsapp */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:whatsapp" width={16} />}
              href={`https://wa.me/${PHONE_SUPPORT}?text=${encodeURIComponent(
                `Hola, tengo información de ${petProfile.petName} 🐾`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              fullWidth
              sx={{
                textTransform: 'none',
                bgcolor: '#25D366',
                '&:hover': { bgcolor: '#128C7E' },
              }}
            >
              Contactar WhatsApp
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
