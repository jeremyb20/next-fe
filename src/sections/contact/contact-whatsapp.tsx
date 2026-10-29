import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Iconify from '@/components/iconify';
import { PHONE_SUPPORT } from '@/config-global';
import { useTranslation } from '@/hooks/use-translation';

// ----------------------------------------------------------------------

const WHATSAPP_NUMBER = PHONE_SUPPORT.replace(/\D/g, '');

export default function ContactWhatsApp() {
  const { t, mounted } = useTranslation();

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t('Hello, I would like to affiliate my business.')
  )}`;

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: alpha('#25D366', 0.08),
        border: '1px solid',
        borderColor: alpha('#25D366', 0.24),
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: 'common.white',
              bgcolor: '#25D366',
            }}
          >
            <Iconify icon="mdi:whatsapp" width={28} />
          </Box>

          <Box>
            <Typography variant="h6">
              {t('Talk to us on WhatsApp')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Get a faster response from our affiliation team.')}
            </Typography>
          </Box>
        </Stack>

        <Button
          fullWidth
          size="large"
          variant="contained"
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<Iconify icon="mdi:whatsapp" width={24} />}
          sx={{
            bgcolor: '#25D366',
            '&:hover': {
              bgcolor: '#128C7E',
            },
          }}
        >
          {t('Chat on WhatsApp')}
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center' }}
        >
          {PHONE_SUPPORT}
        </Typography>
      </Stack>
    </Box>
  );
}
