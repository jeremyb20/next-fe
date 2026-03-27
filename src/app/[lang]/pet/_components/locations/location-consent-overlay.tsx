// components/dashboard/user/location-consent-overlay.tsx

import { useState } from 'react';
import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';

import {
  Box,
  Alert,
  Stack,
  Paper,
  alpha,
  Button,
  useTheme,
  Typography,
  CircularProgress,
} from '@mui/material';

interface LocationConsentOverlayProps {
  onLocationAccepted: (position: GeolocationPosition) => void;
  petName: string;
  isVisible: boolean;
}

export default function LocationConsentOverlay({
  onLocationAccepted,
  petName,
  isVisible,
}: LocationConsentOverlayProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  if (!isVisible) return null;

  const handleAccept = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onLocationAccepted(position);
      },
      (errors) => {
        setLoading(false);
        switch (errors.code) {
          case errors.PERMISSION_DENIED:
            setError(
              'You denied location access. Location is required to view this profile.'
            );
            break;
          case errors.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please try again.');
            break;
          case errors.TIMEOUT:
            setError('Request timed out. Please check your connection.');
            break;
          default:
            setError('An error occurred. Please try again.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: alpha(theme.palette.background.default, 0.98),
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 480,
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Efecto decorativo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        />

        <Stack spacing={3} alignItems="center">
          {/* Icono animado */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.1)',
                },
                '70%': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
                },
                '100%': {
                  transform: 'scale(1)',
                  boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
                },
              },
            }}
          >
            <Iconify
              icon="mdi:map-marker"
              width={48}
              height={48}
              color={theme.palette.primary.main}
            />
          </Box>

          <Typography variant="h4" fontWeight={700}>
            {t('Location Required')}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t('To view')} <strong>{petName}</strong>{' '}
            {t(`profile and help track pet safety, we need your location.`)}
          </Typography>

          <Alert
            severity="info"
            sx={{
              borderRadius: 2,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              {t('Why do we need this?')}
            </Typography>
            <Typography variant="caption" component="div">
              • {t('Records where pets are being viewed')}
              <br />• {t('Helps locate lost pets faster')}
              <br />• {t('Creates a safer community')}
              <br />• {t('Your location is only stored for this view')}
            </Typography>
          </Alert>

          {error && (
            <Alert
              severity="error"
              sx={{ width: '100%', borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {t(error)}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAccept}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                {t('Getting your location...')}
              </>
            ) : (
              <>
                <Iconify icon="mdi:map-marker" width={20} sx={{ mr: 1 }} />
                {t('Share My Location')}
              </>
            )}
          </Button>

          <Typography variant="caption" color="text.secondary">
            🔒{' '}
            {t(
              'Your privacy matters. Location is only used to register this view.'
            )}
            <br />
            {t('You can revoke access anytime in your browser settings.')}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
