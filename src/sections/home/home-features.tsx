import { m } from 'framer-motion';
import Iconify from '@/src/components/iconify';

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
    title: 'Perfil Digital',
    description:
      'Hasta 10 mascotas por cuenta con información completa y accesible mediante código QR.',
  },
  {
    icon: 'uil:medical',
    title: 'Historial Médico',
    description:
      'Registro completo de vacunas, tratamientos y visitas al veterinario en un solo lugar.',
  },
  {
    icon: 'carbon:array-dates',
    title: 'Gestión de Citas',
    description:
      'Agenda citas con veterinarios y peluqueros afiliados de manera rápida y sencilla.',
  },
];

// ----------------------------------------------------------------------

export default function HomeFeatures() {
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
            Características Principales
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            Todo lo que necesitas <br /> para el cuidado de tu mascota
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
                {feature.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {feature.description}
              </Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
