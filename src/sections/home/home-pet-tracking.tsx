import { m } from 'motion/react';
import Carousel from 'react-slick';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useResponsive } from '@/hooks/use-responsive';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import useCarousel from '@/components/carousel/use-carousel';
import { varFade, MotionViewport } from '@/components/animate';

// ----------------------------------------------------------------------

// Datos de ejemplo basados en la imagen
const DESIGNS = [
  {
    id: 1,
    name: 'MAX',
    type: 'Bone',
    size: '4 x 3 cm',
    image: '/assets/images/plaquitas/hueso.png', // Reemplaza con tu imagen real
    color: '#2C2C2C',
    textColor: '#FFFFFF',
    icon: 'mdi:paw',
  },
  {
    id: 2,
    name: 'Luna',
    type: 'Round',
    size: '3 x 3 cm',
    image: '/assets/images/plaquitas/redonda.png',
    color: '#E68A6B',
    textColor: '#FFFFFF',
    icon: 'mdi:paw',
  },
  {
    id: 3,
    name: 'Nala',
    type: 'Heart',
    size: '3 x 3.5 cm',
    image: '/assets/images/plaquitas/corazon.png',
    color: '#8B4513',
    textColor: '#FFFFFF',
    icon: null,
  },
  {
    id: 4,
    name: '', // En la imagen no tiene nombre, solo el icono
    type: 'Paw print',
    size: '3 x 3 cm',
    image: '/assets/images/plaquitas/huella.png',
    color: '#D9813F',
    textColor: '#FFFFFF',
    icon: 'mdi:qrcode',
  },
  {
    id: 5,
    name: 'Rocky',
    type: 'Special',
    size: 'Various shapes',
    image: '/assets/images/plaquitas/especial.png',
    color: '#4A1515',
    textColor: '#FFFFFF',
    icon: 'mdi:format-letter-matches', // Icono de montaña aproximado
  },
];

// ----------------------------------------------------------------------

export default function HomeDesigns() {
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslation();
  const settings = useSettingsContext();

  const carousel = useCarousel({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: mdUp ? 3 : 1, // 3 en desktop, 1 en móvil
    slidesToScroll: 1,
    // Importante: esto ajusta el ancho de los slides para que no se desborden
    centerMode: false,
    appendDots: (dots) => (
      <Box
        sx={{
          position: 'absolute',
          bottom: -30, // Lo subimos un poco
          width: '100%',
          textAlign: 'center',
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}> {dots} </ul>
      </Box>
    ),
    customPaging: () => (
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.3)',
          transition: 'all 0.3s',
          '.slick-active &': {
            bgcolor: 'primary.main',
            transform: 'scale(1.2)',
          },
        }}
      />
    ),
  });

  const renderHeader = (
    <Stack
      spacing={3}
      sx={{
        textAlign: { xs: 'center', md: 'left' },
        // Aumentamos el ancho máximo para que el texto respire más
        maxWidth: { xs: '100%', md: 500 },
        // Aseguramos que no se encoja si el contenedor padre se queda sin espacio
        flexShrink: 0,
        mb: { xs: 5, md: 0 },
      }}
    >
      <m.div variants={varFade().inLeft}>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}
        >
          {t('STYLE AND PERSONALITY')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Typography
          variant="h2"
          sx={{ color: 'common.white', fontWeight: 800 }}
        >
          {t('Designs that adapt to their')}{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            {t('personality')}
          </Box>
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Typography sx={{ color: 'grey.300' }}>
          {t(
            'We have different shapes and colors so you can find the ideal tag for your pet.'
          )}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Button
          component={RouterLink}
          href={paths.product.root || '#'}
          variant="contained"
          size="large"
          startIcon={<Iconify icon="mdi:shield-check-outline" />}
          endIcon={<Iconify icon="mdi:arrow-right" />}
          sx={{
            borderRadius: 50,
            px: 4,
            py: 1.5,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            alignSelf: { xs: 'center', md: 'flex-start' },
          }}
        >
          {t('View all designs')}
        </Button>
      </m.div>
    </Stack>
  );

  const renderCarousel = (
    // Eliminamos el px (padding lateral) de aquí para que no empuje el contenido
    <Box sx={{ position: 'relative', width: '100%', px: 0 }}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {DESIGNS.map((design) => (
          // Añadimos un padding interno al slide, no al contenedor general
          <Box key={design.id} sx={{ py: 3, px: 1 }}>
            <Stack spacing={2} alignItems="center">
              {/* Imagen de la placa (o simulación con CSS) */}
              <Box
                sx={{
                  width: 110, // Ligeramente más pequeño para que quepa bien
                  height: 110,
                  borderRadius:
                    design.type === 'Round'
                      ? '50%'
                      : design.type === 'Heart'
                        ? '16px 16px 50% 50%'
                        : '24px',
                  bgcolor: design.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                {design.icon && (
                  <Iconify
                    icon={design.icon}
                    width={28}
                    sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}
                  />
                )}
                {design.name && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: design.textColor,
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                    }}
                  >
                    {design.name}
                  </Typography>
                )}
              </Box>

              {/* Textos debajo de la placa */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'common.white', fontWeight: 'bold' }}
                >
                  {t(design.type)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>
                  {design.size === 'Various shapes'
                    ? t('Various shapes')
                    : design.size}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}
      </Carousel>

      {/* Flechas de navegación - Ocultas en móvil (xs) para evitar sobreposición */}
      <IconButton
        onClick={carousel.onPrev}
        sx={{
          position: 'absolute',
          left: { xs: -15, md: -30 }, // Las sacamos un poco hacia afuera
          top: '40%',
          color: 'common.white',
          bgcolor: 'rgba(0,0,0,0.2)', // Fondo semitransparente para visibilidad
          backdropFilter: 'blur(4px)',
          display: { xs: 'none', md: 'flex' }, // Ocultar en móvil
          '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' },
          zIndex: 9,
        }}
      >
        <Iconify icon="eva:arrow-ios-back-outline" width={24} />
      </IconButton>

      <IconButton
        onClick={carousel.onNext}
        sx={{
          position: 'absolute',
          right: { xs: -15, md: -30 },
          top: '40%',
          color: 'common.white',
          bgcolor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          display: { xs: 'none', md: 'flex' }, // Ocultar en móvil
          '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' },
          zIndex: 9,
        }}
      >
        <Iconify icon="eva:arrow-ios-forward-outline" width={24} />
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f8e3d0', overflow: 'hidden' }}>
      <Box
        sx={{
          borderRadius: { md: '120px' },
          p: { xs: 10, md: 15 },
          mx: settings.themeStretch ? 0 : 10,
          bgcolor: '#221412',
        }}
      >
        <Container
          maxWidth={settings.themeStretch ? false : 'xl'}
          component={MotionViewport}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            spacing={{ xs: 5, md: 5 }}
          >
            {renderHeader}

            {/* Columna Derecha: Carrusel */}
            <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
              {' '}
              {/* minWidth: 0 evita que flexbox desborde */}
              <m.div variants={varFade().inRight}>
                <Card
                  sx={{
                    bgcolor: '#3D302B',
                    borderRadius: 4,
                    // Ajustamos el padding para dar espacio a las flechas
                    p: { xs: 2, md: 4 },
                    pt: { xs: 4, md: 5 }, // Más padding arriba
                    pb: { xs: 6, md: 7 }, // Más padding abajo para los dots
                    boxShadow: 'none',
                    overflow: 'hidden', // CRUCIAL: Evita que los slides no visibles se salgan
                    position: 'relative',
                  }}
                >
                  {renderCarousel}
                </Card>
              </m.div>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
