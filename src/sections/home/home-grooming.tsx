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

export default function HomeGrooming() {
  const { t } = useTranslation();

  const renderImg = (
    <Image
      alt={t('Professional grooming services for your pet')}
      src="/assets/images/home/grooming-dog.webp"
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
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <m.div variants={varFade().inUp}>
              <Typography variant="h2" component="h2" gutterBottom>
                {t('Professional grooming service')}
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography
                variant="h4"
                component="h3"
                color="text.secondary"
                paragraph
              >
                {t('Care for your pets appearance with the best professionals')}
              </Typography>
            </m.div>

            <Stack spacing={3}>
              <m.div variants={varFade().inUp}>
                <Typography variant="h6" component="h4">
                  • {t('Bath and professional drying')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="body1" component="p">
                  • {t('Haircut according to breed')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="body1" component="p">
                  • {t('Nail trimming and ear cleaning')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="body1" component="p">
                  • {t('Special beauty treatments')}
                </Typography>
              </m.div>
            </Stack>

            <m.div variants={varFade().inUp}>
              <Button variant="contained" size="large" sx={{ mt: 3 }}>
                {t('Affiliate my Business')}
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
