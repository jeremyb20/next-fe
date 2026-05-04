// components/registration-type-selector.tsx

'use client';

import Iconify from '@/components/iconify';
import { APP_NAME } from '@/config-global';
import { useTranslation } from '@/hooks/use-translation';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

interface RegistrationTypeSelectorProps {
  onSelect: (type: 'new' | 'existing') => void;
}

export function RegistrationTypeSelector({
  onSelect,
}: RegistrationTypeSelectorProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('Register Your Pet')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('Choose how you want to register your new pet')}
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ maxWidth: 600, mx: 'auto' }}
      >
        {/* Opción: Nuevo usuario */}
        <Paper
          onClick={() => onSelect('new')}
          sx={{
            p: 4,
            cursor: 'pointer',
            border: (theme) => `2px solid ${theme.palette.primary.light}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => theme.shadows[8],
              borderColor: (theme) => theme.palette.primary.main,
              bgcolor: '#c8fad614',
            },
          }}
        >
          <Box sx={{ mb: 2, color: 'primary.main' }}>
            <Iconify icon="mdi:account-plus" width={48} />
          </Box>
          <Typography variant="h6" gutterBottom>
            {t('New to')} {APP_NAME}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('Create a new account and register your first pet')}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => onSelect('new')}
          >
            {t('Get Started')}
          </Button>
        </Paper>

        {/* Opción: Usuario existente */}
        <Paper
          onClick={() => onSelect('existing')}
          sx={{
            p: 4,
            cursor: 'pointer',
            border: (theme) => `2px solid ${theme.palette.secondary.light}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => theme.shadows[8],
              borderColor: (theme) => theme.palette.secondary.main,
              bgcolor: '#efd6ff1a',
            },
          }}
        >
          <Box sx={{ mb: 2, color: 'secondary.main' }}>
            <Iconify icon="mdi:account-check" width={48} />
          </Box>
          <Typography variant="h6" gutterBottom>
            {t('Existing Account')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('Already have an account? Add a new pet to your profile')}
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => onSelect('existing')}
          >
            {t('Add Pet')}
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
}
