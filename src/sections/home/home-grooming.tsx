import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

export default function HomeGrooming() {
  const { t } = useTranslation();

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
                <Typography variant="h6">
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
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1719464454959-9cf304ef4774?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Servicios de peluquería"
                sx={{ width: '100%', maxWidth: 500, borderRadius: 2 }}
              />
            </m.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
