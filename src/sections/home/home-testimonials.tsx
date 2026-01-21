/* eslint-disable no-nested-ternary */
import { m } from 'framer-motion';
import Carousel from 'react-slick';
import { APP_NAME } from '@/src/config-global';
import { useTranslation } from 'react-i18next';
import useCarousel from '@/src/components/carousel/use-carousel';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const TESTIMONIALS = [
  {
    id: 1,
    name: 'María González',
    role: 'Dueña de 3 mascotas',
    avatar: '/assets/images/avatars/avatar-1.webp',
    rating: 5,
    content:
      'Increíble aplicación! Perdí a mi gato y gracias al código QR en su placa, me contactaron en menos de 2 horas. La paz mental que me da es invaluable.',
    pet: 'Gato - Simba',
    location: 'San José, Costa Rica',
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    role: 'Dueño de mascotas',
    avatar: '/assets/images/avatars/avatar-2.webp',
    rating: 5,
    content:
      'Como dueño de 2 perros y 1 gato, la gestión de vacunas y citas veterinarias se ha vuelto mucho más sencilla. Nunca más olvidaré una vacuna.',
    pet: 'Perros - Max y Luna',
    location: 'Cartago, Costa Rica',
  },
  {
    id: 3,
    name: 'Dr. Alejandro Martínez',
    role: 'Veterinario Afiliado',
    avatar: '/assets/images/avatars/avatar-3.webp',
    rating: 5,
    content:
      'Desde que me afilié, mi consulta ha aumentado en un 40%. La plataforma me permite gestionar citas eficientemente y los historiales médicos digitales son un gran avance.',
    pet: 'Clínica VetCare',
    location: 'Heredia, Costa Rica',
  },
  {
    id: 4,
    name: 'Ana López',
    role: 'Dueña de mascota',
    avatar: '/assets/images/avatars/avatar-4.webp',
    rating: 5,
    content:
      'El servicio de grooming a través de la app es excelente. Puedo ver disponibilidad, precios y reviews de cada profesional. Mi perro siempre sale feliz!',
    pet: 'Perro - Rocky',
    location: 'Alajuela, Costa Rica',
  },
  {
    id: 5,
    name: 'Pedro Sánchez',
    role: 'Peluquero Canino',
    avatar: '/assets/images/avatars/avatar-5.webp',
    rating: 5,
    content: `${APP_NAME} ha transformado mi negocio. Ahora tengo agenda completa toda la semana y los clientes llegan con toda la información de sus mascotas. Muy profesional.`,
    pet: 'PetGroom Studio',
    location: 'Desamparados, Costa Rica',
  },
  {
    id: 6,
    name: 'Laura Mendoza',
    role: 'Dueña de mascotas senior',
    avatar: '/assets/images/avatars/avatar-6.webp',
    rating: 5,
    content:
      'Para mí que tengo problemas de memoria, esta app es una bendición. Recordatorios de medicamentos, citas y todo el historial de mi perro senior en un lugar.',
    pet: 'Perro - Toby (12 años)',
    location: 'Puntarenas, Costa Rica',
  },
];

// ----------------------------------------------------------------------

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    content: string;
    pet: string;
    location: string;
  };
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card
      sx={{
        px: 4,
        py: 5,
        mx: 1,
        textAlign: 'center',
        bgcolor: 'background.default',
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      {/* Rating */}
      <m.div variants={varFade().inUp}>
        <Rating value={testimonial.rating} readOnly size="large" />
      </m.div>

      {/* Content */}
      <m.div variants={varFade().inUp}>
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            mb: 4,
            fontStyle: 'italic',
            color: 'text.secondary',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          &ldquo;{testimonial.content}&rdquo;
        </Typography>
      </m.div>

      {/* Avatar and Info */}
      <m.div variants={varFade().inUp}>
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={testimonial.avatar}
            alt={testimonial.name}
            sx={{
              width: 64,
              height: 64,
              border: (theme) =>
                `2px solid ${alpha(theme.palette.primary.main, 0.24)}`,
            }}
          />

          <Box>
            <Typography variant="h6" gutterBottom>
              {testimonial.name}
            </Typography>

            <Typography variant="body2" color="primary.main" gutterBottom>
              {testimonial.role}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {testimonial.pet}
            </Typography>

            <Typography variant="caption" color="text.disabled" display="block">
              {testimonial.location}
            </Typography>
          </Box>
        </Stack>
      </m.div>
    </Card>
  );
}

// ----------------------------------------------------------------------

export default function HomeTestimonials() {
  const themes = useTheme();
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');
  const { t } = useTranslation();

  const carousel = useCarousel({
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: mdUp ? 3 : smUp ? 2 : 1,
    slidesToScroll: mdUp ? 3 : smUp ? 2 : 1,
    infinite: true,
    responsive: [
      {
        breakpoint: themes.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: themes.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  const renderHeader = (
    <Stack spacing={3} sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
      <m.div variants={varFade().inUp}>
        <Typography
          component="div"
          variant="overline"
          sx={{ color: 'text.disabled' }}
        >
          {t('From our users')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2">
          {t('What do they say about us')} <br />
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          {t(
            'Discover why thousands of pet owners veterinarians and professionals trust'
          )}{' '}
          {APP_NAME} {t('for the care of their animals.')}
        </Typography>
      </m.div>
    </Stack>
  );

  const renderCarousel = (
    <Box sx={{ position: 'relative' }}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {TESTIMONIALS.map((testimonial) => (
          <Box key={testimonial.id} sx={{ px: 1, py: 2 }}>
            <TestimonialCard testimonial={testimonial} />
          </Box>
        ))}
      </Carousel>

      {/* Navigation Buttons */}
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 5 }}>
        <IconButton
          onClick={carousel.onPrev}
          sx={{
            width: 48,
            height: 48,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
            '&:hover': {
              bgcolor: 'background.neutral',
            },
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={24} />
        </IconButton>

        <IconButton
          onClick={carousel.onNext}
          sx={{
            width: 48,
            height: 48,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
            '&:hover': {
              bgcolor: 'background.neutral',
            },
          }}
        >
          <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
        </IconButton>
      </Stack>
    </Box>
  );

  const renderStats = (
    <Box
      sx={{
        mt: { xs: 10, md: 15 },
        p: 5,
        borderRadius: 3,
        bgcolor: 'background.neutral',
        textAlign: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 5, md: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        {[
          { number: '50K+', label: 'Pets Registered' },
          { number: '1.2K+', label: 'Affiliated Veterinarians' },
          { number: '800+', label: 'Certified Groomers' },
          { number: '4.9/5', label: 'Average Rating' },
        ].map((stat, index) => (
          <m.div key={stat.label} variants={varFade().inUp}>
            <Stack spacing={1}>
              <Typography variant="h2" color="primary.main">
                {stat.number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(stat.label)}
              </Typography>
            </Stack>
          </m.div>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: 'background.neutral',
      }}
    >
      <Container component={MotionViewport}>
        {renderHeader}

        {renderCarousel}

        {renderStats}
      </Container>
    </Box>
  );
}
