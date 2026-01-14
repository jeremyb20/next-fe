import { m } from 'framer-motion';
import Iconify from '@/src/components/iconify';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    // icon: '/assets/icons/pets/ic_pet_profile.svg',
    icon: 'uil:10-plus',
    title: 'Digital Profile',
    description:
      'Up to 10 pets per account with complete information and accessible via QR code.',
  },
  {
    icon: 'uil:medical',
    title: 'Medical History',
    description:
      'Complete record of vaccines, treatments and veterinary visits in one place.',
  },
  {
    icon: 'carbon:array-dates',
    title: 'Appointment Management',
    description:
      'Schedule appointments with affiliated veterinarians and groomers quickly and easily.',
  },
];

// ----------------------------------------------------------------------

export default function HomeFeatures() {
  const { t } = useTranslation();

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            component="div"
            variant="overline"
            sx={{ color: 'text.disabled' }}
          >
            {t('Key Features')}
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            {t('Everything you need')} <br /> {t('for the care of your pet')}
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 10 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {FEATURES.map((feature, index) => (
          <m.div variants={varFade().inUp} key={feature.title}>
            <Card
              sx={{
                textAlign: 'center',
                boxShadow: { md: 'none' },
                bgcolor: 'background.default',
                p: (theme) => theme.spacing(10, 5),
                ...(index === 1 && {
                  boxShadow: (theme) => ({
                    md: `-40px 40px 80px ${
                      theme.palette.mode === 'light'
                        ? alpha(theme.palette.grey[500], 0.16)
                        : alpha(theme.palette.common.black, 0.4)
                    }`,
                  }),
                }),
              }}
            >
              {/* <Box
                component="img"
                src={feature.icon}
                alt={feature.title}
                sx={{ mx: 'auto', width: 64, height: 64 }}
              /> */}
              <Iconify
                icon={feature.icon}
                sx={{ mx: 'auto', width: 64, height: 64 }}
              />

              <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
                {t(feature.title)}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {t(feature.description)}
              </Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
