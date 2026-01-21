import { m } from 'framer-motion';
import Iconify from '@/src/components/iconify';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const SERVICES = [
  {
    title: 'Veterinarians',
    description: 'Find affiliated veterinarians and schedule consultations',
    icon: 'wpf:medical-doctor',
    color: 'primary',
  },
  {
    title: 'Grooming',
    description: 'Professional grooming services for your pet',
    icon: 'temaki:pet-grooming',
    color: 'secondary',
  },
  {
    title: 'Stores',
    description: 'Products and accessories with exclusive discounts',
    icon: 'hugeicons:store-location-02',
    color: 'info',
  },
];

export default function HomeServices() {
  const { t } = useTranslation();

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
      <Stack spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2">{t('Available Services')}</Typography>
        </m.div>
        <m.div variants={varFade().inUp}>
          <Typography variant="h6" color="text.secondary">
            {t('Everything you need for your well-being in one place')}
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={4}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {SERVICES.map((service, index) => (
          <m.div key={service.title} variants={varFade().inUp}>
            <Card
              sx={{
                p: 5,
                textAlign: 'center',
                boxShadow: (theme) => theme.customShadows.z8,
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows.z24,
                },
              }}
            >
              {/* <Box
                component="img"
                src={service.icon}
                alt={service.title}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 3 }}
              /> */}
              <Iconify
                icon={service.icon}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 3 }}
              />

              <Typography variant="h5" gutterBottom>
                {t(service.title)}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t(service.description)}
              </Typography>

              <Button variant="outlined" color={service.color as any}>
                {t('Know more')}
              </Button>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
