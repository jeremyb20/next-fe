import { m } from 'motion/react';
import Carousel from 'react-slick';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { _socials } from '@/_mock';
import Iconify from '@/components/iconify';
import { useResponsive } from '@/hooks/use-responsive';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import useCarousel from '@/components/carousel/use-carousel';
import { varFade, MotionViewport } from '@/components/animate';

// ----------------------------------------------------------------------

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Maria G.',
    content:
      'The quality is incredible and the design is beautiful. My dog looks great with his tag.',
    avatar: '/assets/images/avatars/avatar-1.webp',
    rating: 5,
  },
  {
    id: 2,
    name: 'Carlos R.',
    content:
      'It helped us find our dog in less than 1 hour. Totally recommended!',
    avatar: '/assets/images/avatars/avatar-2.webp',
    rating: 5,
  },
  {
    id: 3,
    name: 'Laura M.',
    content:
      'Easy to set up and customer service is excellent. Very satisfying!',
    avatar: '/assets/images/avatars/avatar-3.webp',
    rating: 5,
  },
  {
    id: 4,
    name: 'Ana P.',
    content:
      "The material is very good quality, it hasn't worn off with daily use. Excellent purchase.",
    avatar: '/assets/images/avatars/avatar-4.webp',
    rating: 5,
  },
];

// ----------------------------------------------------------------------
interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    content: string;
  };
}
function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const lightMode = theme.palette.mode === 'light';

  return (
    <Card
      sx={{
        p: 3,
        height: '100%', // OBLIGATORIO: Para que ocupe toda la altura del slide
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: 'none',
      }}
    >
      <Avatar
        src={testimonial.avatar}
        alt={testimonial.name}
        sx={{
          width: 56,
          height: 56,
          mr: 2,
          border: (theme) =>
            `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        }}
      />

      <Stack spacing={1} sx={{ flex: 1, height: '100%' }}>
        <Rating
          value={testimonial.rating}
          readOnly
          size="small"
          sx={{ color: '#F5A623' }}
        />

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            lineHeight: 1.5,
            fontSize: '0.85rem',
            flexGrow: 1, // Empuja el autor hacia abajo si el texto es corto
          }}
        >
          {t(testimonial.content)}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 1 }}>
          <Avatar src={testimonial.avatar} sx={{ width: 24, height: 24 }} />
          <Typography
            variant="caption"
            sx={{ color: lightMode ? 'text.primary' : '#000', fontWeight: 600 }}
          >
            {testimonial.name}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export default function HomeTestimonials() {
  const theme = useTheme();
  const { t } = useTranslation();
  const mdUp = useResponsive('up', 'md');
  const settings = useSettingsContext();
  const lightMode = theme.palette.mode === 'light';

  const carousel = useCarousel({
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    // MOSTRAMOS 3 EN DESKTOP COMO PEDISTE ORIGINALMENTE
    slidesToShow: mdUp ? 3 : 1,
    slidesToScroll: 1,
    infinite: true,
    // CRUCIAL: Esto hace que react-slick estire los slides a la misma altura
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  const renderHeader = (
    <Stack
      spacing={3}
      sx={{
        textAlign: { xs: 'center', md: 'left' },
        maxWidth: { xs: '100%', md: 450 },
        flexShrink: 0,
        mb: { xs: 5, md: 0 },
      }}
    >
      <m.div variants={varFade().inLeft}>
        <Typography
          variant="overline"
          sx={{ color: '#A53D00', fontWeight: 700, letterSpacing: 1.5 }}
        >
          {t('WHAT OUR CUSTOMERS SAY')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Typography
          variant="h2"
          sx={{ color: lightMode ? 'text.primary' : '#000', fontWeight: 800 }}
        >
          {t('Real stories,')} <br /> {t('safe pets')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Typography sx={{ color: 'text.secondary', mb: 4 }}>
          {t(
            'Thousands of families already trust our tags. Discover their experiences.'
          )}
        </Typography>
      </m.div>

      <m.div variants={varFade().inLeft}>
        <Button
          onClick={() => window.open(_socials[0].path, '_blank')}
          variant="contained"
          size="large"
          sx={{
            color: 'common.white',
            borderRadius: 50,
            px: 4,
            py: 1.5,
            bgcolor: '#A53D00',
            '&:hover': { bgcolor: '#7A2D00' },
            fontWeight: 'bold',
            alignSelf: { xs: 'center', md: 'flex-start' },
          }}
        >
          {t('See more reviews')}
        </Button>
      </m.div>
    </Stack>
  );

  const renderCarousel = (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        // ESTO ES VITAL: Obliga a los slides de slick a tener la misma altura y usar flex
        '& .slick-track': {
          display: 'flex',
          alignItems: 'stretch',
        },
        '& .slick-slide': {
          height: 'auto',
          '& > div': {
            height: '100%',
          },
        },
      }}
    >
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {TESTIMONIALS.map((testimonial) => (
          // El padding va aquí para separar las tarjetas
          <Box key={testimonial.id} sx={{ py: 2, px: 1, height: '100%' }}>
            <TestimonialCard testimonial={testimonial} />
          </Box>
        ))}
      </Carousel>

      <IconButton
        onClick={carousel.onPrev}
        sx={{
          position: 'absolute',
          left: { xs: -15, md: -20 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'common.white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': { bgcolor: 'grey.100' },
          display: { xs: 'none', md: 'flex' },
          zIndex: 9,
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={24} />
      </IconButton>

      <IconButton
        onClick={carousel.onNext}
        sx={{
          position: 'absolute',
          right: { xs: -15, md: -20 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'common.white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': { bgcolor: 'grey.100' },
          display: { xs: 'none', md: 'flex' },
          zIndex: 9,
        }}
      >
        <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
      </IconButton>
    </Box>
  );

  return (
    <Box
      sx={{
        bgcolor: '#FBF3EA',
        py: { xs: 10, md: 12 },
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth={settings.themeStretch ? false : 'xl'}
        component={MotionViewport}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 5, md: 6 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {renderHeader}

          <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
            <m.div variants={varFade().inRight}>{renderCarousel}</m.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
