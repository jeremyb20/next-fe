import { m } from 'motion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import { MotionViewport, varFade } from '@/components/animate';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: 'mdi:qrcode-scan',
    title: 'Custom QR code',
    description: "Immediate access to your pet's information.",
  },
  {
    icon: 'mdi:shield-check-outline',
    title: 'Durable material',
    description:
      'Made of aluminum, ideal for daily use and all kinds of adventures.',
  },
  {
    icon: 'mdi:palette-outline',
    title: 'Unique designs',
    description: 'A variety of shapes and colors for every style.',
  },
  {
    icon: 'mdi:cloud-outline',
    title: 'Cloud profile',
    description: 'Your information always safe and up to date.',
  },
];

// ----------------------------------------------------------------------

export default function HomeFeatures() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsContext();
  const lightMode = theme.palette.mode === 'light';

  return (
    // Contenedor principal con el fondo melocotón y el borde curvo
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
          py: { xs: 10, md: 15 },
          bgcolor: '#f9ecdc',
        }}
      >
        <Container
          maxWidth={settings.themeStretch ? false : 'xl'}
          component={MotionViewport}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            // Redujimos un poco el espaciado para que quepan mejor los textos y la tarjeta
            spacing={{ xs: 5, md: 4 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LADO IZQUIERDO: Textos y Botón */}
            <Stack
              spacing={3}
              sx={{
                // Ajustamos el ancho para que no empuje demasiado a la tarjeta
                maxWidth: { xs: '100%', md: 380 },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <m.div variants={varFade().inLeft}>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    fontSize: '0.85rem',
                  }}
                >
                  {t('Why choose our tags?')}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    color: lightMode ? 'text.primary' : '#000',
                    mt: 1,
                    mb: 2,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    fontSize: { xs: '2rem', md: '2.5rem' }, // Tamaño ajustado
                  }}
                >
                  {t('Technology that protects those')} <br />
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    {t('you love most')}
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
                    'Our QR tags are designed to give your family and pet peace of mind, combining durability, design and technology.'
                  )}
                </Typography>
                <Button
                  component={RouterLink}
                  href={paths.product.root || '#'}
                  variant="contained"
                  size="large"
                  sx={{
                    color: 'common.white',
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    bgcolor: '#A53D00', // Color marrón/naranja oscuro de la imagen
                    '&:hover': { bgcolor: '#7A2D00' },
                    fontWeight: 'bold',
                  }}
                >
                  {t('Learn more')}
                </Button>
              </m.div>
            </Stack>

            {/* LADO DERECHO: Tarjeta con los 4 ítems */}
            <Box sx={{ width: '100%', flex: 1 }}>
              <m.div variants={varFade().inRight}>
                <Card
                  sx={{
                    // Fondo crema de la tarjeta
                    bgcolor: '#FDF8F4',
                    // Bordes bien redondeados
                    borderRadius: 6,
                    p: { xs: 3, md: 4 },
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)', // Sombra sutil
                    border: 'none', // Quitamos el borde gris
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 4, sm: 0 }}
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          display: { xs: 'none', sm: 'block' },
                          borderColor: 'rgba(0,0,0,0.06)', // Divisor muy sutil
                        }}
                      />
                    }
                    justifyContent="space-between"
                  >
                    {FEATURES.map((feature) => (
                      <Stack
                        key={feature.title}
                        spacing={2}
                        alignItems="center"
                        sx={{
                          textAlign: 'center',
                          flex: 1,
                          px: { sm: 1, md: 1.5 },
                        }}
                      >
                        {/* Círculo de fondo para el icono */}
                        <Box
                          sx={{
                            width: 172, // Tamaño reducido para que quepa mejor
                            height: 172,
                            borderRadius: '50%',
                            bgcolor: '#FDE3CB', // Color melocotón del círculo
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Iconify
                            icon={feature.icon}
                            width={76} // Icono ajustado
                            sx={{ color: '#4A1C00' }} // Marrón muy oscuro
                          />
                        </Box>

                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            color: lightMode ? 'text.primary' : '#000',
                          }}
                        >
                          {t(feature.title)}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: lightMode ? 'text.primary' : '#201e1e',
                            display: 'block',
                            lineHeight: 1.4,
                            fontSize: '0.75rem', // Texto más pequeño
                          }}
                        >
                          {t(feature.description)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              </m.div>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
