// components/dashboard/user/promotions-card.tsx

'use client';

import { m } from 'framer-motion';
import { IPromotions } from '@/types/api';
import Iconify from '@/components/iconify';
import { useTranslation } from 'react-i18next';
import { varFade, MotionContainer } from '@/components/animate';
import Carousel, { useCarousel, CarouselDots } from '@/components/carousel';

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
  useMediaQuery,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Configuración responsive similar a MenuProducts
  const getSlidesToShow = () => {
    if (isMobile) return 1.02;
    if (isTablet) return 1.2;
    return 1;
  };

  const carousel = useCarousel({
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    autoplay,
    autoplaySpeed,
    infinite: promotions.length > 1,
    ...CarouselDots({
      sx: { mt: 2, position: 'absolute', bottom: -20, left: 0, right: 0 },
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
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        boxShadow: theme.shadows[2],
        bgcolor: 'transparent',
      }}
    >
      <Box sx={{ position: 'relative', px: { xs: 0, md: 0 } }}>
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
    buttonTextRedirect = 'View Offer',
  } = promotion;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hasImage = customIMG || urlImage;
  const imageUrl = customIMG || urlImage;

  return (
    <MotionContainer
      action
      animate={active}
      sx={{ position: 'relative', px: 1 }}
    >
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 210, md: 310 },
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
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

        {/* Contenedor principal */}
        <Box
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: { xs: 1.5, md: 4 },
            py: { xs: 2, md: 4 },
          }}
        >
          <Stack
            spacing={isMobile ? 1 : 2}
            sx={{
              width: { xs: '100%', md: '75%' },
              maxWidth: 520,
              color: 'common.white',
            }}
          >
            <m.div variants={varFade().inUp}>
              <Chip
                label={`${discount}% OFF`}
                size="small"
                sx={{
                  width: 'fit-content',
                  bgcolor: alpha(theme.palette.error.main, 0.95),
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: { xs: '0.5rem', md: '0.8rem' },
                  px: 0.75,
                  py: 1.5,
                  letterSpacing: '0.5px',
                  borderRadius: 1,
                }}
              />
            </m.div>

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

          <m.div variants={varFade().inUp}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: '100%', mt: { xs: 1, md: 2 } }}
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
                {t(buttonTextRedirect) || t('View offer')}
              </Button>
            </Stack>
          </m.div>
        </Box>
      </Box>
    </MotionContainer>
  );
}
