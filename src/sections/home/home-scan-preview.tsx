import { m } from 'motion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { useRouter } from '@/routes/hooks';
import { useBoolean } from '@/hooks/use-boolean';
import QrScannerDialog from '@/components/qr-scanner';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import { varFade, MotionViewport } from '@/components/animate';

// ----------------------------------------------------------------------

export default function HomeScanPreview() {
  const { t } = useTranslation();
  const settings = useSettingsContext();
  const router = useRouter();
  const scanner = useBoolean();

  const handleScanResult = (value: string) => {
    scanner.onFalse();

    const code = value.trim();
    if (!code) return;

    if (code.startsWith('/')) {
      router.push(code);
      return;
    }

    try {
      const url = new URL(code);

      if (url.origin === window.location.origin) {
        router.push(`${url.pathname}${url.search}${url.hash}`);
      } else {
        window.location.href = code;
      }
    } catch {
      router.push(paths.pet.details(encodeURIComponent(code)));
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8e3d0', py: { xs: 10, md: 15 } }}>
      <Container
        maxWidth={settings.themeStretch ? false : 'xl'}
        component={MotionViewport}
      >
        {/* Tarjeta contenedora principal (Fondo oscuro) */}
        <Card
          sx={{
            bgcolor: '#2A1D1A', // Color de fondo oscuro de la imagen
            borderRadius: { xs: 4, md: 8 }, // Bordes muy redondeados
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="stretch"
            // En desktop, la imagen izquierda ocupa un 35%, el centro un 40% y la derecha un 25%
            spacing={0}
          >
            {/* 1. IMAGEN IZQUIERDA: Escaneo */}
            <Box
              sx={{
                width: { xs: '100%', md: '55%' },
                minHeight: { xs: 300, md: 'auto' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="/assets/images/digital-id/pet-scan.jpg"
                alt={t('Scanning QR code')}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  // Degradado sutil para fundir la imagen con el fondo oscuro de la tarjeta
                  maskImage: {
                    md: 'linear-gradient(to right, black 70%, transparent 100%)',
                  },
                  WebkitMaskImage: {
                    md: 'linear-gradient(to right, black 70%, transparent 100%)',
                  },
                }}
              />

              {/* Texto manuscrito simulado (Opcional, si no viene en la imagen) */}
              <Typography
                sx={{
                  position: 'absolute',
                  top: '15%',
                  left: '10%',
                  color: '#E8B893',
                  fontFamily: 'cursive',
                  fontSize: '1.2rem',
                  transform: 'rotate(-10deg)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                {t('Scan the code')}
              </Typography>
            </Box>

            {/* 2. CENTRO: Textos y Botón */}
            <Stack
              spacing={3}
              sx={{
                width: { xs: '100%', md: '40%' },
                p: { xs: 4, md: 6 },
                justifyContent: 'center',
                textAlign: { xs: 'center', md: 'left' },
                zIndex: 2, // Para que quede por encima de los degradados
              }}
            >
              <m.div variants={varFade().inUp}>
                <Typography
                  variant="overline"
                  sx={{
                    color: '#E87536', // Naranja brillante
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    fontSize: '0.85rem',
                  }}
                >
                  {t('REAL TECHNOLOGY')}
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'common.white',
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {t("This is what your pet's profile looks like")}
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography sx={{ color: 'grey.400', fontSize: '0.95rem' }}>
                  {t(
                    "Scan the sample QR code and discover what your pet's profile looks like in action."
                  )}
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Button
                  onClick={scanner.onTrue}
                  variant="outlined"
                  size="large"
                  startIcon={<Iconify icon="mdi:qrcode-scan" />}
                  sx={{
                    mt: 2,
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    color: 'common.white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'common.white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {t('Scan sample code')}
                </Button>
              </m.div>
            </Stack>

            {/* 3. DERECHA: Imagen del Celular */}
            <Box
              sx={{
                width: { xs: '100%', md: '25%' },
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end', // Alineado abajo
                justifyContent: 'center',
                pt: { xs: 0, md: 4 }, // Espacio arriba
                pr: { xs: 0, md: 4 },
              }}
            >
              <Box
                component="img"
                src="/assets/images/digital-id/phone-profile.png"
                alt={t('Pet profile on phone')}
                sx={{
                  width: { xs: '80%', md: '100%' },
                  maxWidth: 280,
                  objectFit: 'contain',
                  // Efecto de sombra para despegar el celular del fondo
                  filter: 'drop-shadow(-10px 10px 20px rgba(0,0,0,0.5))',
                }}
              />

              {/* Texto manuscrito simulado derecho */}
              <Typography
                sx={{
                  position: 'absolute',
                  top: '30%',
                  right: '5%',
                  color: '#E8B893',
                  fontFamily: 'cursive',
                  fontSize: '1.2rem',
                  transform: 'rotate(10deg)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                {t('That easy!')}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Container>

      <QrScannerDialog
        open={scanner.value}
        onCloseAction={scanner.onFalse}
        onResultAction={handleScanResult}
      />
    </Box>
  );
}
