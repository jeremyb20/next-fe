import { m } from 'motion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import { varFade, MotionViewport } from '@/components/animate';

// ----------------------------------------------------------------------

const STEPS = [
  {
    number: '1',
    title: 'Register the information',
    description: "Add your pet's details and your contact information.",
    icon: 'mdi:qrcode-scan',
  },
  {
    number: '2',
    title: 'Customize your tag',
    description: 'Choose the design, color and size you like best.',
    icon: 'mdi:cart-outline',
  },
  {
    number: '3',
    title: 'Done!',
    description: 'Your pet will be protected and always connected.',
    icon: 'mdi:dog-side',
  },
];

// ----------------------------------------------------------------------

export default function HomeServices() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsContext();
  const lightMode = theme.palette.mode === 'light';

  return (
    <Box
      sx={{
        bgcolor: '#f8e3d0', // Color de fondo más exacto a la imagen

        overflow: 'hidden',

        width: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          borderRadius: { md: '400px 0 120px 0' },
          p: { xs: 10, md: 15 },
          bgcolor: '#f9ecdc',
        }}
      >
        <Container
          maxWidth={settings.themeStretch ? false : 'xl'}
          component={MotionViewport}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 6, md: 4 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LADO IZQUIERDO: Textos y Botón */}
            <Stack
              spacing={3}
              sx={{
                maxWidth: { xs: '100%', md: 350 },
                textAlign: { xs: 'center', md: 'left' },
                flexShrink: 0,
              }}
            >
              <m.div variants={varFade().inLeft}>
                <Typography
                  variant="overline"
                  sx={{
                    color: '#A53D00',
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    fontSize: '0.85rem',
                  }}
                >
                  {t('SUPER EASY')}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    color: lightMode ? 'text.primary' : '#000',
                    mt: 1,
                    mb: 2,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  {t('In')}{' '}
                  <Box component="span" sx={{ color: '#A53D00' }}>
                    {t('3 simple steps')}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    color: lightMode ? 'text.primary' : '#000',
                    mb: 4,
                    fontSize: '0.95rem',
                  }}
                >
                  {t(
                    'A quick and simple process so your pet is always protected.'
                  )}
                </Typography>
                <Button
                  component={RouterLink}
                  href={paths.auth.signUp || '#'}
                  variant="contained"
                  size="large"
                  endIcon={<Iconify icon="mdi:arrow-right" />}
                  sx={{
                    color: 'common.white',
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    bgcolor: '#A53D00',
                    '&:hover': { bgcolor: '#7A2D00' },
                    fontWeight: 'bold',
                  }}
                >
                  {t('How it works')}
                </Button>
              </m.div>
            </Stack>

            {/* LADO DERECHO: Los 3 Pasos */}
            <Box sx={{ width: '100%', flex: 1 }}>
              <m.div variants={varFade().inRight}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={{ xs: 6, md: 0 }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {STEPS.map((step, index) => (
                    <Stack
                      key={step.number}
                      direction={{ xs: 'column', md: 'row' }}
                      alignItems="center"
                      spacing={2}
                      sx={{ flex: 1, width: '100%' }}
                    >
                      {/* Bloque del Paso Individual */}
                      <Stack
                        spacing={2}
                        alignItems="center"
                        sx={{ textAlign: 'center', flex: 1 }}
                      >
                        {/* Círculo con icono y número */}
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              bgcolor: '#FDEBD2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Iconify
                              icon={step.icon}
                              width={80}
                              sx={{ color: '#A53D00' }}
                            />
                          </Box>
                          {/* Insignia con el número */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: { xs: 'calc(50% - 50px)', md: 0 },
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: '#A53D00',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {step.number}
                          </Box>
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: lightMode ? 'text.primary' : '#000',
                          }}
                        >
                          {t(step.title)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: lightMode ? 'text.primary' : '#000',
                            lineHeight: 1.4,
                            maxWidth: 180,
                          }}
                        >
                          {t(step.description)}
                        </Typography>
                      </Stack>

                      {/* Flecha separadora (solo entre pasos y en desktop) */}
                      {index < STEPS.length - 1 && (
                        <Box
                          sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: 2,
                          }}
                        >
                          <Iconify
                            icon="mdi:arrow-right"
                            width={32}
                            sx={{ color: '#A53D00', opacity: 0.6 }}
                          />
                        </Box>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </m.div>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
