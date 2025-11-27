import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const BENEFITS = [
  {
    icon: 'mdi:account-group',
    title: 'Más Pacientes',
    description:
      'Aumenta tu cartera de clientes conectando con dueños de mascotas en tu área',
  },
  {
    icon: 'mdi:calendar-clock',
    title: 'Gestión de Citas',
    description:
      'Sistema de agendamiento automatizado que reduce tiempos muertos',
  },
  {
    icon: 'mdi:medical-bag',
    title: 'Historial Médico',
    description:
      'Acceso completo al historial médico de las mascotas que atiendes',
  },
  {
    icon: 'mdi:chart-line',
    title: 'Crecimiento Profesional',
    description:
      'Herramientas para expandir y profesionalizar tu consulta veterinaria',
  },
];

const SERVICES = [
  'Consultas generales y especializadas',
  'Vacunación y desparasitación',
  'Cirugías y procedimientos',
  'Laboratorio clínico',
  'Hospitalización',
  'Medicina preventiva',
  'Dermatología veterinaria',
  'Oftalmología especializada',
];

// ----------------------------------------------------------------------

export default function HomeVeterinarians() {
  const themes = useTheme();
  const mdUp = useResponsive('up', 'md');

  const renderBenefits = (
    <Box
      sx={{
        display: 'grid',
        gap: 4,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        },
      }}
    >
      {BENEFITS.map((benefit, index) => (
        <m.div key={benefit.title} variants={varFade().inUp}>
          <Card
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              bgcolor: 'background.default',
              border: (theme) =>
                `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z16,
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                bgcolor: alpha(themes.palette.primary.main, 0.08),
                mr: 3,
                flexShrink: 0,
              }}
            >
              <Iconify icon={benefit.icon} width={32} />
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {benefit.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {benefit.description}
              </Typography>
            </Box>
          </Card>
        </m.div>
      ))}
    </Box>
  );

  const renderServices = (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          },
        }}
      >
        {SERVICES.map((service, index) => (
          <m.div key={service} variants={varFade().inUp}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  flexShrink: 0,
                }}
              />
              <Typography variant="body1">{service}</Typography>
            </Stack>
          </m.div>
        ))}
      </Box>
    </Box>
  );

  const renderDescription = (
    <Stack spacing={5} sx={{ color: 'common.white' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ opacity: 0.64 }}>
          Para Profesionales
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2">
          Únete a Nuestra <br />
          Red de Veterinarios
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          Conecta con dueños de mascotas, gestiona tu consulta y haz crecer tu
          negocio con nuestras herramientas profesionales
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>{renderBenefits}</m.div>

      <m.div variants={varFade().inUp}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            component={RouterLink}
            href={paths.veterinarian.register}
            color="primary"
            size="large"
            variant="contained"
            startIcon={<Iconify icon="mdi:hospital-building" width={24} />}
            sx={{
              bgcolor: 'common.white',
              color: 'grey.800',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Registrar Mi Consulta
          </Button>

          <Button
            component={RouterLink}
            href={paths.auth.login}
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="mdi:login" width={24} />}
            sx={{
              borderColor: 'common.white',
              color: 'common.white',
              '&:hover': {
                bgcolor: alpha(themes.palette.common.white, 0.08),
              },
            }}
          >
            Ya Estoy Registrado
          </Button>
        </Stack>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Stack spacing={6}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h3" gutterBottom>
          Servicios Veterinarios
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Ofrecemos una plataforma completa para gestionar todos los aspectos de
          tu consulta veterinaria
        </Typography>
      </m.div>

      {renderServices}

      <m.div variants={varFade().inUp}>
        <Card
          sx={{
            p: 4,
            mt: 3,
            bgcolor: alpha(themes.palette.primary.main, 0.04),
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" color="primary.main">
              ¿Eres una clínica establecida?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nuestra plataforma se integra perfectamente con tu operación
              actual. Ofrecemos planes especiales para clínicas con múltiples
              veterinarios y personal.
            </Typography>
            <Button
              variant="text"
              color="primary"
              endIcon={<Iconify icon="mdi:arrow-right" />}
            >
              Conocer Planes para Clínicas
            </Button>
          </Stack>
        </Card>
      </m.div>
    </Stack>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Sección superior con gradiente */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          ...bgGradient({
            color: alpha(themes.palette.primary.dark, 0.9),
            imgUrl:
              'https://images.unsplash.com/photo-1700665537604-412e89a285c3?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }),
        }}
      >
        <Container component={MotionViewport}>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 8, md: 12 },
              gridTemplateColumns: { md: '1fr 1fr' },
              alignItems: 'center',
            }}
          >
            <Box>{renderDescription}</Box>

            {mdUp && (
              <m.div variants={varFade().inUp}>
                <Box
                  component="img"
                  src="https://plus.unsplash.com/premium_photo-1661373614644-97e5f1158baa?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Veterinarios"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 2,
                    boxShadow: (theme) => theme.customShadows.z24,
                  }}
                />
              </m.div>
            )}
          </Box>
        </Container>
      </Box>

      {/* Sección inferior con servicios */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          bgcolor: 'background.default',
        }}
      >
        <Container component={MotionViewport}>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 8, md: 12 },
              gridTemplateColumns: { md: '1fr 1fr' },
              alignItems: 'center',
            }}
          >
            <Box>
              <m.div variants={varFade().inUp}>
                <Box
                  component="img"
                  src="/assets/images/home/vet_services.png"
                  alt="Servicios veterinarios"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 2,
                  }}
                />
              </m.div>
            </Box>

            <Box>{renderContent}</Box>
          </Box>
        </Container>
      </Box>

      {/* Llamada a la acción final */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          bgcolor: 'background.neutral',
        }}
      >
        <Container component={MotionViewport}>
          <Stack
            spacing={4}
            sx={{
              textAlign: 'center',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <m.div variants={varFade().inUp}>
              <Typography variant="h2">Comienza Hoy Mismo</Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography variant="h6" color="text.secondary">
                Únete a la red de veterinarios más confiable y comienza a
                recibir nuevos pacientes desde el primer día
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  component={RouterLink}
                  href={paths.veterinarian.register}
                  color="primary"
                  size="large"
                  variant="contained"
                  startIcon={<Iconify icon="mdi:account-plus" width={24} />}
                >
                  Crear Cuenta Gratis
                </Button>

                <Button
                  component={RouterLink}
                  href={paths.contact}
                  color="inherit"
                  size="large"
                  variant="outlined"
                  startIcon={<Iconify icon="mdi:chat-question" width={24} />}
                >
                  Solicitar Demo
                </Button>
              </Stack>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography variant="caption" color="text.disabled">
                • Sin costos iniciales • Primeros 30 días gratuitos • Soporte
                personalizado
              </Typography>
            </m.div>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
