// components/dashboard/user/quick-actions.tsx
import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';

import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

interface QuickActionsProps {
  onAddPet?: () => void;
  onMyPets?: () => void;
  onFindVet?: () => void;
  onShare?: () => void;
}

export function QuickActions({
  onAddPet,
  onMyPets,
  onFindVet,
  onShare,
}: QuickActionsProps) {
  const { t } = useTranslation();

  const actions = [
    {
      id: 'add-pet',
      label: t('Add pet'),
      icon: 'mdi:plus',
      onClick: onAddPet,
    },
    {
      id: 'walk-pet',
      label: t('My Pets'),
      icon: 'mdi:paw',
      onClick: onMyPets,
    },
    {
      id: 'find-vet',
      label: t('Find vet'),
      icon: 'mdi:doctor',
      onClick: onFindVet,
    },
    {
      id: 'share',
      label: t('Share'),
      icon: 'mdi:share-variant',
      onClick: onShare,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
          ⚡ {t('Quick Actions')}
        </Typography>

        <Grid container spacing={1}>
          {actions.map((action) => (
            <Grid item xs={3} key={action.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.7 },
                }}
                onClick={action.onClick}
              >
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    width: 40,
                    height: 40,
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  <Iconify icon={action.icon} sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography
                  variant="caption"
                  textAlign="center"
                  sx={{ fontSize: '0.7rem' }}
                >
                  {action.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Paper>
  );
}
