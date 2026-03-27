import { m } from 'framer-motion';
import Image from '@/components/image';
import { useTranslation } from '@/hooks/use-translation';
import { varFade, MotionViewport } from '@/components/animate';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function HomeGrooming() {
  const { t } = useTranslation();
  const renderImg = (
    <Image
      alt={t('Professional grooming services for your pet')}
      src="/assets/images/home/grooming-dog.webp"
      width="100%" // Mantiene el responsive
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
              <Typography variant="h2" gutterBottom>
                {t('Professional grooming service')}
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography variant="h6" color="text.secondary" paragraph>
                {t('Care for your pets appearance with the best professionals')}
              </Typography>
            </m.div>

            <Stack spacing={3}>
              <m.div variants={varFade().inUp}>
                <Typography variant="h5">
                  • {t('Bath and professional drying')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="h6">
                  • {t('Haircut according to breed')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="h6">
                  • {t('Nail trimming and ear cleaning')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="h6">
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
            <m.div variants={varFade().inUp}>
              {/* <Box
                component="img"
                src="../../../public/assets/images/home/grooming-dog.webp"
                alt="Servicios de peluquería"
                sx={{ width: '100%', maxWidth: 500, borderRadius: 2 }}
              /> */}
              {renderImg}
            </m.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
