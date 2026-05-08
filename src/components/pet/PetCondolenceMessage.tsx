// components/PetCondolenceMessage.tsx
import { IPetProfile } from '@/types/api';
import { useTranslation } from '@/hooks/use-translation';

import { Box, Alert, Paper, AlertTitle, Typography } from '@mui/material';

import Iconify from '../iconify';

interface PetCondolenceMessageProps {
  pet: IPetProfile;
  variant?: 'alert' | 'card' | 'banner';
  onClose?: () => void;
}

export const PetCondolenceMessage = ({
  pet,
  variant = 'alert',
  onClose,
}: PetCondolenceMessageProps) => {
  const { t } = useTranslation();
  const message = {
    title: t('In memory of {{petName}}', { petName: pet.petName }),
    body: t(
      'We are deeply saddened by the passing of {{petName}} Our deepest condolences to the family. May they find comfort in the beautiful memories they shared.',
      { petName: pet.petName }
    ),

    quote: `"${t(
      'There is no love purer than the love our pets give us. They will always live on in our hearts.'
    )}"`,
  };

  if (variant === 'alert') {
    return (
      <Alert
        severity="error"
        icon={<Iconify icon="entypo:awareness-ribbon" />}
        onClose={onClose}
        sx={{
          borderLeft: '4px solid #d32f2f',
          '& .MuiAlert-icon': { fontSize: '2rem' },
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>{message.title}</AlertTitle>
        {message.body}
      </Alert>
    );
  }

  if (variant === 'card') {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: 'background.neutral',
          borderTop: '4px solid #d32f2f',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h6" gutterBottom>
          {message.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {message.body}
        </Typography>
        <Typography variant="caption" fontStyle="italic" display="block">
          {message.quote}
        </Typography>
        <Box
          component="img"
          src="/assets/images/ribbon.png"
          alt="Decorative"
          sx={{
            position: 'absolute',
            bottom: pet.petStatus === 'deceased' ? -2 : -12,
            right: pet.petStatus === 'deceased' ? -12 : -30,
            width: 140,
            height: 'auto',
            objectFit: 'contain',
            zIndex: 0,
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#fee',
        p: 2,
        borderRadius: 2,
        border: '1px solid #ffcdd2',
      }}
    >
      <Typography variant="body2">🕊️ {message.body}</Typography>
    </Box>
  );
};
