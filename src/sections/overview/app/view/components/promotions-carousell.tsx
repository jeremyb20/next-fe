// components/dashboard/user/promotions-card.tsx

'use client';

import { m } from 'framer-motion';
import { IPromotions } from '@/types/api';
import Iconify from '@/components/iconify';
import { useTranslation } from 'react-i18next';
import { varFade, MotionContainer } from '@/components/animate';
import Carousel, {
  useCarousel,
  CarouselDots,
  CarouselArrows,
} from '@/components/carousel';

import {
  Box,
  Card,
  Chip,
  Stack,
  alpha,
  Button,
  useTheme,
  Typography,
} from '@mui/material';

interface PromotionsCardProps {
  promotions: IPromotions[];
  onViewOffer?: (promotion: IPromotions) => void;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

export function PromotionsCardCaroussell({
  promotions,
  onViewOffer,
  autoplay = true,
  autoplaySpeed = 5000,
}: PromotionsCardProps) {
  const theme = useTheme();

  const carousel = useCarousel({
    speed: 800,
    autoplay,
    autoplaySpeed,
    ...CarouselDots({
      sx: {
        bottom: 16,
        left: 0,
        right: 0,
        position: 'absolute',
        color: 'primary.main',
        '& .slick-active': {
          '& .MuiBox-root': {
            bgcolor: 'primary.main',
            width: 24,
          },
        },
      },
    }),
  });

  if (promotions.length === 0) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          '& .carousel-arrows': {
            opacity: 1,
          },
        },
      }}
    >
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {promotions.map((promotion, index) => (
          <CarouselItem
            key={promotion._id}
            promotion={promotion}
            active={index === carousel.currentIndex}
            onViewOffer={onViewOffer}
            formatDate={formatDate}
          />
        ))}
      </Carousel>

      <CarouselArrows
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
        className="carousel-arrows"
        sx={{
          top: '50%',
          transform: 'translateY(-50%)',
          position: 'absolute',
          left: 8,
          right: 8,
          justifyContent: 'space-between',
          opacity: 0,
          transition: 'opacity 0.3s',
          '& .MuiIconButton-root': {
            bgcolor: alpha(theme.palette.common.white, 0.8),
            backdropFilter: 'blur(4px)',
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.9),
            },
          },
        }}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  promotion: IPromotions;
  active?: boolean;
  onViewOffer?: (promotion: IPromotions) => void;
  formatDate: (date: string) => string;
};

function CarouselItem({
  promotion,
  active,
  onViewOffer,
  formatDate,
}: CarouselItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    title,
    description,
    discount,
    validUntil,
    urlImage,
    icon = 'mdi:tag',
    type,
  } = promotion;

  // Renderizar con imagen si existe, sino con gradiente
  const renderWithImage = urlImage ? (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: {
          xs: 280,
          md: 320,
        },
        backgroundImage: `linear-gradient(to bottom, ${alpha(
          theme.palette.grey[900],
          0
        )} 0%, ${alpha(theme.palette.grey[900], 0.7)} 100%), url(${urlImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  ) : (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: {
          xs: 220,
          md: 220,
        },
        background: `linear-gradient(135deg, background.paper 0%, background.paper 100%)`,
      }}
    />
  );

  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      {/* Contenido superpuesto */}
      <Stack
        spacing={1.5}
        sx={{
          p: 3,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        {/* Badge de descuento */}
        <m.div variants={varFade().inUp}>
          <Chip
            label={`${discount}% OFF`}
            size="small"
            sx={{
              width: 'fit-content',
              bgcolor: alpha(theme.palette.error.main, 0.9),
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.75rem',
              backdropFilter: 'blur(4px)',
            }}
          />
        </m.div>

        {/* Título */}
        <m.div variants={varFade().inUp}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Iconify icon={icon} width={28} />
            {title}
          </Typography>
        </m.div>

        {/* Descripción */}
        <m.div variants={varFade().inUp}>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        </m.div>

        {/* Tipo de promoción (opcional) */}
        {type && (
          <m.div variants={varFade().inUp}>
            <Chip
              label={type.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{
                width: 'fit-content',
                borderColor: alpha(theme.palette.common.white, 0.5),
                color: 'common.white',
                fontSize: '0.65rem',
              }}
            />
          </m.div>
        )}

        {/* Footer con fecha y botón */}
        <m.div variants={varFade().inUp}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <Chip
              label={`📅 ${formatDate(validUntil)}`}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.2),
                color: '#fff',
                backdropFilter: 'blur(4px)',
              }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: '#fff',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.9),
                },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
              onClick={() => onViewOffer?.(promotion)}
            >
              {t('View offer')} →
            </Button>
          </Stack>
        </m.div>
      </Stack>

      {/* Imagen de fondo */}
      {renderWithImage}
    </MotionContainer>
  );
}
