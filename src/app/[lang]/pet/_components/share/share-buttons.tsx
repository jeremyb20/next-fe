import React from 'react';
import { IPetProfile } from '@/src/types/api';
import { useTranslation } from 'react-i18next';
import {
  EmailShareButton,
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from 'react-share';

import { Box, Grid, Button, Typography } from '@mui/material';

import { ShareIcon } from './share-icon';

interface Props {
  petProfile: IPetProfile;
  shareUrl: string;
  isMobile: boolean;
  shareTitle: string;
  shareDescription: string;
  onClose: () => void;
}

export default function ShareButtons({
  petProfile,
  shareUrl,
  isMobile,
  shareTitle,
  shareDescription,
  onClose,
}: Props) {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 600 }}>
        {t('Share with friends')} {petProfile?.petName}
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={2.4} sm={2.4} sx={{ textAlign: 'center' }}>
          <FacebookShareButton url={shareUrl} hashtag="#Mascotas">
            <ShareIcon platform="facebook" size={isMobile ? 56 : 64} />
          </FacebookShareButton>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Facebook
          </Typography>
        </Grid>

        <Grid item xs={2.4} sm={2.4} sx={{ textAlign: 'center' }}>
          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            hashtags={['Mascotas', 'Animales']}
          >
            <ShareIcon platform="twitter" size={isMobile ? 56 : 64} />
          </TwitterShareButton>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            X (Twitter)
          </Typography>
        </Grid>

        <Grid item xs={2.4} sm={2.4} sx={{ textAlign: 'center' }}>
          <WhatsappShareButton url={shareUrl} title={shareTitle} separator=": ">
            <ShareIcon platform="whatsapp" size={isMobile ? 56 : 64} />
          </WhatsappShareButton>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            WhatsApp
          </Typography>
        </Grid>

        <Grid item xs={2.4} sm={2.4} sx={{ textAlign: 'center' }}>
          <TelegramShareButton url={shareUrl} title={shareTitle}>
            <ShareIcon platform="telegram" size={isMobile ? 56 : 64} />
          </TelegramShareButton>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Telegram
          </Typography>
        </Grid>

        <Grid item xs={2.4} sm={2.4} sx={{ textAlign: 'center' }}>
          <EmailShareButton
            url={shareUrl}
            subject={shareTitle}
            body={shareDescription}
          >
            <ShareIcon platform="email" size={isMobile ? 56 : 64} />
          </EmailShareButton>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Email
          </Typography>
        </Grid>
      </Grid>

      {!isMobile && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
            {t('Close')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
