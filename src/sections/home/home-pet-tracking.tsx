import { m } from 'framer-motion';
import Iconify from '@/src/components/iconify';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

export default function HomePetTracking() {
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
                {t('Complete Health Monitoring')}
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography variant="h6" color="text.secondary" paragraph>
                {t(
                  'Monitor your pets health and receive personalized recommendations.'
                )}
              </Typography>
            </m.div>

            <Stack spacing={2}>
              {[
                'Complete Health Monitoring',
                'Monitor your pets health and receive personalized recommendations.',
                'Vaccination tracking and reminders',
                'Health records and medical history',
                'Appointment scheduling with vets and groomers',
                'Personalized care recommendations',
              ].map((item, index) => (
                <m.div key={item} variants={varFade().inUp}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                    <Typography>{t(item)}</Typography>
                  </Stack>
                </m.div>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <m.div variants={varFade().inUp}>
              {/* <Box
                component="img"
                src="https://img.freepik.com/premium-vector/veterinarian-with-pet-people-takes-care-animals-doctor-helps-kitten-puppy-vet-hospital-nurse-character-with-cat-dog-visit-veterinary-clinic-vector-cartoon-design_176516-6136.jpg?w=2000"
                alt="Seguimiento de mascotas"
                sx={{ width: '100%', maxWidth: 500, borderRadius: 3 }}
              /> */}
              <Iconify
                icon="uil:file-medical-alt"
                height={300}
                width={300}
                sx={{ width: '100%', maxWidth: 500, borderRadius: 3 }}
              />
            </m.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
