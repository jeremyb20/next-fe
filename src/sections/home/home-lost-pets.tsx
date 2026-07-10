import { m } from 'motion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from '@/components/image';
import { useTranslation } from '@/hooks/use-translation';
import { varFade, MotionViewport } from '@/components/animate';

export default function HomeLostPets() {
  const { t } = useTranslation();

  const renderImg = (
    <Image
      alt={t('Report lost pets and help them find their way home')}
      src="/assets/images/home/lost-pet.webp"
      width="100%"
      height={350}
      sx={{
        borderRadius: 2,
        my: { xs: 5, md: 10 },
        boxShadow: (theme) =>
          `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
        objectFit: 'cover',
      }}
    />
  );

  return (
    <Box sx={{ bgcolor: 'background.neutral', py: { xs: 10, md: 15 } }}>
      <Container component={MotionViewport}>
        <Stack
          spacing={5}
          direction={{ xs: 'column', md: 'row-reverse' }}
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <m.div variants={varFade().inUp}>
              <Typography variant="h2" component="h2" gutterBottom>
                {t('Lost pet reporting service')}
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography
                variant="h4"
                component="h3"
                color="text.secondary"
                paragraph
              >
                {t('Help reunite lost pets with their families')}
              </Typography>
            </m.div>

            <Stack spacing={3}>
              <m.div variants={varFade().inUp}>
                <Typography variant="h6" component="h4">
                  • {t('Create lost pet reports')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="body1" component="p">
                  • {t('Add photos and descriptions')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="body1" component="p">
                  • {t('Share on social networks')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="body1" component="p">
                  • {t('Community alerts and notifications')}
                </Typography>
              </m.div>
            </Stack>

            <m.div variants={varFade().inUp}>
              <Button variant="contained" size="large" sx={{ mt: 3 }}>
                {t('Report Lost Pet')}
              </Button>
            </m.div>
          </Box>

          <Box sx={{ flex: 1 }}>
            <m.div variants={varFade().inUp}>{renderImg}</m.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
