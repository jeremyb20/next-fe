// components/dashboard/user/promotions-card.tsx
import Iconify from '@/components/iconify';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  Chip,
  Button,
  Typography,
  CardContent,
} from '@mui/material';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  icon?: string;
}

interface PromotionsCardProps {
  promotions: Promotion[];
  onViewOffer?: (promotion: Promotion) => void;
}

export function PromotionsCard({
  promotions,
  onViewOffer,
}: PromotionsCardProps) {
  const { t } = useTranslation();

  if (promotions.length === 0) return null;

  const mainPromotion = promotions[0];

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
          <Iconify icon="mdi:tag" sx={{ fontSize: 120 }} />
        </Box>

        <Typography
          variant="caption"
          sx={{ opacity: 0.9, mb: 1, display: 'block' }}
        >
          {t('Special Promotion!')}
        </Typography>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          {mainPromotion.discount}% {t('off')} {mainPromotion.title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          {mainPromotion.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={`${t('Valid until')} ${mainPromotion.validUntil}`}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
          />
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#fff',
              color: '#667eea',
              '&:hover': { bgcolor: '#f5f5f5' },
              borderRadius: 2,
            }}
            onClick={() => onViewOffer?.(mainPromotion)}
          >
            {t('View offer')} →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
