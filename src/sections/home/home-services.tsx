import { m } from 'framer-motion';
import Iconify from '@/src/components/iconify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const SERVICES = [
  {
    title: 'Veterinarias',
    description: 'Encuentra veterinarias afiliadas y agenda consultas',
    icon: 'wpf:medical-doctor',
    color: 'primary',
  },
  {
    title: 'Peluquería',
    description: 'Servicios de grooming profesionales para tu mascota',
    icon: 'temaki:pet-grooming',
    color: 'secondary',
  },
  {
    title: 'Tiendas',
    description: 'Productos y accesorios con descuentos exclusivos',
    icon: 'hugeicons:store-location-02',
    color: 'info',
  },
];

export default function HomeServices() {
  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
      <Stack spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2">Servicios Disponibles</Typography>
        </m.div>
        <m.div variants={varFade().inUp}>
          <Typography variant="h6" color="text.secondary">
            Todo lo que necesitas para el bienestar de tu mascota en un solo
            lugar
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
                {service.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {service.description}
              </Typography>

              <Button variant="outlined" color={service.color as any}>
                Conocer más
              </Button>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
