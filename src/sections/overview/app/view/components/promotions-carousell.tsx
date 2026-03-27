// components/dashboard/user/promotions-card.tsx

'use client';

import { m } from 'framer-motion';
import { IPromotions } from '@/types/api';
import Iconify from '@/components/iconify';
import { useTranslation } from 'react-i18next';
import Carousel, { useCarousel } from '@/components/carousel';
import { varFade, MotionContainer } from '@/components/animate';

import {
  Box,
  Card,
  Chip,
  Stack,
  alpha,
  Button,
  Divider,
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
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: theme.shadows[2],
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

      {/* Controles personalizados: Puntos con barra de progreso */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 10,
        }}
      >
        {/* Puntos indicadores */}
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            '& .dot': {
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.5),
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&.active': {
                width: 20,
                borderRadius: 3,
                bgcolor: 'primary.main',
              },
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 0.8),
              },
            },
          }}
        >
          {promotions.map((_, index) => (
            <Box
              key={index}
              className={`dot ${
                index === carousel.currentIndex ? 'active' : ''
              }`}
              onClick={() => carousel.carouselRef?.current?.slickGoTo(index)}
            />
          ))}
        </Stack>

        {/* Barra de progreso (timing) */}
        {autoplay && (
          <Box
            sx={{
              width: { xs: 80, md: 100 },
              height: 2,
              bgcolor: alpha(theme.palette.common.white, 0.3),
              borderRadius: 1,
              overflow: 'hidden',
              cursor: 'pointer',
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
            onClick={() => carousel.carouselRef?.current?.slickPause()}
          >
            <Box
              key={carousel.currentIndex}
              sx={{
                width: '0%',
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 1,
                animation: `progress ${autoplaySpeed}ms linear forwards`,
                '@keyframes progress': {
                  '0%': { width: '0%' },
                  '100%': { width: '100%' },
                },
              }}
            />
          </Box>
        )}
      </Box>
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
    type,
    customIMG,
  } = promotion;

  const hasImage = customIMG || urlImage;
  const imageUrl = customIMG || urlImage;

  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative', minHeight: { xs: 240, md: 280 } }}>
        {/* Imagen de fondo */}
        {hasImage && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Capa oscura sobre la imagen */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.65),
          }}
        />

        {/* Contenedor principal con diseño editorial compacto */}
        <Box
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: { xs: 2.5, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          {/* Sección superior: contenido principal */}
          <Stack
            spacing={2}
            sx={{
              width: { xs: '100%', md: '75%' },
              maxWidth: 520,
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
                  bgcolor: alpha(theme.palette.error.main, 0.95),
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  px: 0.75,
                  py: 1.5,
                  letterSpacing: '0.5px',
                  borderRadius: 1,
                }}
              />
            </m.div>

            {/* Categoría/Type */}
            {type && (
              <m.div variants={varFade().inUp}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 1,
                    color: alpha(theme.palette.common.white, 0.7),
                    fontSize: '0.7rem',
                  }}
                >
                  {type.toUpperCase()}
                </Typography>
              </m.div>
            )}

            {/* Título principal */}
            <m.div variants={varFade().inUp}>
              <Typography
                fontWeight={800}
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                {title}
              </Typography>
            </m.div>

            {/* Descripción */}
            <m.div variants={varFade().inUp}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  opacity: 0.85,
                  maxWidth: '95%',
                }}
              >
                {description}
              </Typography>
            </m.div>

            {/* Línea divisoria decorativa */}
            <m.div variants={varFade().inUp}>
              <Divider
                sx={{
                  width: 50,
                  borderColor: alpha(theme.palette.common.white, 0.3),
                  borderWidth: 1.5,
                }}
              />
            </m.div>
          </Stack>

          {/* Sección inferior: footer con fecha y botón separados al 100% */}
          <m.div variants={varFade().inUp}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: '100%',
                mt: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.75,
                  letterSpacing: 0.3,
                  fontSize: '0.7rem',
                }}
              >
                📅 {formatDate(validUntil).toUpperCase()}
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#fff',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.9),
                    transform: 'translateX(2px)',
                  },
                  borderRadius: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  px: 2,
                  py: 0.75,
                  fontSize: '0.7rem',
                  minWidth: 'auto',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => onViewOffer?.(promotion)}
                endIcon={<Iconify icon="mdi:arrow-right" width={14} />}
              >
                {t('View offer')}
              </Button>
            </Stack>
          </m.div>
        </Box>
      </Box>
    </MotionContainer>
  );
}
