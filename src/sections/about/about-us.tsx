import React from 'react';
import { APP_NAME } from '@/src/config-global';
import Iconify from '@/src/components/iconify';

import {
  Box,
  Grid,
  Card,
  Paper,
  Divider,
  useTheme,
  Container,
  Typography,
  CardContent,
} from '@mui/material';

const AboutUs = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <Iconify icon="ic:outline-pets" sx={{ fontSize: 40 }} />,
      title: 'Bienestar Animal',
      description:
        'Nuestra razón de ser es el cuidado y protección de las mascotas.',
    },
    {
      icon: <Iconify icon="ic:outline-family-restroom" sx={{ fontSize: 40 }} />,
      title: 'Origen Familiar',
      description: 'Empresa familiar costarricense con valores arraigados.',
    },
    {
      icon: <Iconify icon="ic:outline-update" sx={{ fontSize: 40 }} />,
      title: 'Innovación Constante',
      description: 'Tecnología actualizada para soluciones permanentes.',
    },
    {
      icon: <Iconify icon="ic:outline-groups" sx={{ fontSize: 40 }} />,
      title: 'Comunidad',
      description: 'Crecimos gracias a la confianza de miles de familias.',
    },
  ];

  const milestones = [
    { year: '2021', event: 'Nacimiento de Plaquitas CR' },
    { year: '2021', event: 'Lanzamiento de Plaquitas Inteligentes' },
    { year: 'Actualidad', event: 'Más de 5,000 mascotas protegidas' },
    { year: 'Próximo', event: 'Nuevas soluciones en desarrollo' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          mb: 6,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Nuestra Historia
            </Typography>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Desde febrero de 2021, en {APP_NAME} trabajamos por el bienestar
              animal.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              Somos una empresa familiar costarricense que nació por una
              necesidad genuina y con la visión creativa de una pareja que vio
              un problema y se comprometió a crear nuevas posibilidades.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: 300,
                borderRadius: 2,
                overflow: 'hidden',
                background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon="ic:outline-rocket-launch"
                sx={{ fontSize: 120, color: 'white', opacity: 0.8 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Story Section */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Iconify
                    icon="ic:outline-location-on"
                    color="primary"
                    sx={{ mr: 2, fontSize: 40 }}
                  />
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    El Problema que nos Movilizó
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Nos tocó vivir la experiencia de perder a nuestras mascotas,
                  así como ver sufrir a seres queridos por la misma situación.
                  Sentimos esa mezcla de emociones inexplicable: la angustia, la
                  incertidumbre, la desesperación.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  No podíamos aceptar que en pleno 2021 la identificación de
                  mascotas siguiera siendo escasa, tediosa y con fechas de
                  vencimiento, dejando vulnerables a nuestros compañeros de
                  vida.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Iconify
                    icon="ic:outline-nature"
                    color="secondary"
                    sx={{ mr: 2, fontSize: 40 }}
                  />
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    La Solución que Creemos
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Vimos claramente que una identificación de mascotas más
                  completa, actualizada y permanente era no solo posible, sino
                  absolutamente necesaria. Con la tecnología como aliada,
                  podíamos dar una solución real y efectiva.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Así nació nuestro compromiso: revolucionar la forma en que
                  protegemos a nuestras mascotas, haciendo de su seguridad algo
                  accesible, moderno y permanente.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Journey Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 6 }}
        >
          Nuestro Camino
        </Typography>
        <Box
          sx={{
            position: 'relative',
            p: 4,
            borderRadius: 2,
            background: 'background.default',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                El Comienzo
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Empezamos a reunir al pequeño pero gran equipo que, a día de hoy
                sigue siendo el mismo corazón de nuestra empresa. Dedicamos
                meses de trabajo intenso, investigación y desarrollo para lanzar{' '}
                {APP_NAME} con nuestro primer producto: las{' '}
                <strong>Plaquitas Inteligentes</strong>.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                El Crecimiento
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Gracias a la hermosa comunidad que confió en nosotros desde el
                primer momento, seguimos creciendo. Trabajamos con mucho
                entusiasmo y dedicación para seguir evolucionando y poder
                ofrecer más y mejores soluciones, no solo para la recuperación
                de mascotas perdidas, sino para su bienestar integral.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Nuestros Valores
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ mb: 2, color: theme.palette.primary.main }}>
                    {value.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Milestones Timeline */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Nuestra Trayectoria
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <Divider
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              zIndex: 0,
            }}
          />
          <Grid container spacing={2}>
            {milestones.map((milestone, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    borderRadius: 2,
                    textAlign: 'center',
                    p: 2,
                    background: theme.palette.background.paper,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="div"
                    color="primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {milestone.year}
                  </Typography>
                  <Typography variant="body1">{milestone.event}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Call to Action */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 2,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
        }}
      >
        <Iconify icon="ic:outline-rocket-launch" sx={{ fontSize: 60, mb: 3 }} />
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          El Futuro que Construimos Juntos
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
          Tenemos muchos desafíos por delante y muchas ganas de superarlos.
          Seguimos innovando, creciendo y mejorando para ofrecerles las mejores
          soluciones para el bienestar de sus mascotas.
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          ¿Nos acompañás en este viaje?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Juntos, hagamos que ninguna mascota se pierda y que todas tengan la
          protección que merecen.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutUs;
