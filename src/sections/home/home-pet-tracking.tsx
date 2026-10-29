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

const DESIGNS = [
  {
    id: 1,
    name: 'MAX',
    type: 'Hueso',
    size: '4 x 3 cm',
    image: '/assets/images/plaquitas/hueso.png', // Asegúrate de que la ruta sea correcta
  },
  {
    id: 2,
    name: 'Luna',
    type: 'Redonda',
    size: '3 x 3 cm',
    image: '/assets/images/plaquitas/redonda.png',
  },
  {
    id: 3,
    name: 'Nala',
    type: 'Corazón',
    size: '3 x 3.5 cm',
    image: '/assets/images/plaquitas/corazon.png',
  },
  {
    id: 4,
    name: '',
    type: 'Huella',
    size: '3 x 3 cm',
    image: '/assets/images/plaquitas/huella.png',
  },
  {
    id: 5,
    name: 'Rocky',
    type: 'Especial',
    size: 'Varias formas',
    image: '/assets/images/plaquitas/especial.png',
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
    slidesToShow: mdUp ? 3 : 1,
    slidesToScroll: 1,
    centerMode: false,
    appendDots: (dots) => (
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: -20, md: -30 },
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
        maxWidth: { xs: '100%', md: 450 },
        flexShrink: 0,
        mb: { xs: 2, md: 0 },
      }}
    >
      <m.div variants={varFade().inLeft}>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}
        >
          {t('ESTILO Y PERSONALIDAD')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Typography
          variant="h2"
          sx={{
            color: 'common.white',
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          {t('Diseños que se adaptan a su')}{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            {t('personalidad')}
          </Box>
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Typography
          sx={{ color: 'grey.300', fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          {t(
            'Tenemos diferentes formas y colores para que encuentres la plaquita ideal para tu mascota.'
          )}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Button
          component={RouterLink}
          href={paths.personalization || '#'}
          variant="contained"
          size="large"
          startIcon={<Iconify icon="mdi:shield-check-outline" />}
          endIcon={<Iconify icon="mdi:arrow-right" />}
          sx={{
            borderRadius: 50,
            px: { xs: 3, md: 4 },
            py: { xs: 1.2, md: 1.5 },
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            alignSelf: { xs: 'center', md: 'flex-start' },
            fontSize: { xs: '0.85rem', md: '1rem' },
          }}
        >
          {t('Ver todos los diseños')}
        </Button>
      </m.div>
    </Stack>
  );

  const renderCarousel = (
    <Box sx={{ position: 'relative', width: '100%', px: 0 }}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {DESIGNS.map((design) => (
          <Box key={design.id} sx={{ py: 3, px: 1 }}>
            <Stack spacing={3} alignItems="center">
              {/* IMAGEN REAL DE LA PLACA */}
              <Box
                component="img"
                src={design.image}
                alt={design.name || design.type}
                sx={{
                  width: '100%',
                  maxWidth: { xs: 140, md: 160 }, // Tamaño máximo de la imagen
                  height: 'auto', // Mantiene la proporción
                  objectFit: 'contain',
                  // Efecto de sombra para que resalte sobre el fondo oscuro
                  filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.4))',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)', // Efecto hover interactivo
                  },
                }}
              />

              {/* Textos debajo de la placa */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'common.white', fontWeight: 'bold' }}
                >
                  {t(design.type)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', mt: 0.5 }}>
                  {design.size === 'Varias formas'
                    ? t('Varias formas')
                    : design.size}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}
      </Carousel>

      {/* Flechas de navegación */}
      <IconButton
        onClick={carousel.onPrev}
        sx={{
          position: 'absolute',
          left: { xs: -10, md: -30 },
          top: '40%',
          color: 'common.white',
          bgcolor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          display: { xs: 'none', sm: 'flex' },
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
          right: { xs: -10, md: -30 },
          top: '40%',
          color: 'common.white',
          bgcolor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          display: { xs: 'none', sm: 'flex' },
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
          borderRadius: { xs: '40px', md: '120px' },
          p: { xs: 4, sm: 6, md: 15 },
          mx: { xs: 2, md: settings.themeStretch ? 0 : 10 },
          bgcolor: '#221412',
        }}
      >
        <Container
          maxWidth={settings.themeStretch ? false : 'xl'}
          component={MotionViewport}
          disableGutters
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            spacing={{ xs: 6, md: 5 }}
          >
            {renderHeader}

            {/* Columna Derecha: Carrusel */}
            <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
              <m.div variants={varFade().inRight}>
                <Card
                  sx={{
                    bgcolor: '#3D302B',
                    borderRadius: { xs: 3, md: 4 },
                    p: { xs: 2, md: 4 },
                    pt: { xs: 3, md: 5 },
                    pb: { xs: 5, md: 7 },
                    boxShadow: 'none',
                    overflow: 'hidden',
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
