import { m } from 'motion/react';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  Paper,
  Container,
  Typography,
  CardContent,
  Avatar,
} from '@mui/material';

import Logo from '@/components/logo';
import { APP_NAME } from '@/config-global';
import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';
import { MotionViewport, varFade } from '@/components/animate'; // Importante para las animaciones

const AboutUs = () => {
  const { t } = useTranslation();

  const primaryColor = '#A53D00'; // Naranja oscuro principal

  const values = [
    {
      icon: 'ic:outline-pets',
      title: 'Animal Welfare',
      description: 'Our purpose is to care for and protect pets.',
    },
    {
      icon: 'ic:outline-family-restroom',
      title: 'Family Origin',
      description: 'Costa Rican family business with deeply rooted values.',
    },
    {
      icon: 'ic:outline-update',
      title: 'Constant Innovation',
      description: 'Updated technology for permanent solutions.',
    },
    {
      icon: 'ic:outline-groups',
      title: 'Community',
      description: 'We grew thanks to the trust of thousands of families.',
    },
  ];

  const milestones = [
    {
      year: '2021',
      event: 'Birth of {{appName}}',
      icon: 'mdi:rocket-launch-outline',
    },
    {
      year: '2021',
      event: 'Launch of Smart Tags',
      icon: 'mdi:tag-outline',
    },
    {
      year: 'Currently',
      event: 'More than 5,000 pets protected',
      icon: 'mdi:shield-check-outline',
    },
    {
      year: 'Coming soon',
      event: 'New solutions in development',
      icon: 'mdi:lightbulb-on-outline',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" component={MotionViewport}>
        {/* 1. HERO SECTION */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            mb: { xs: 8, md: 12 },
            borderRadius: 6,
            background: `linear-gradient(135deg, ${alpha(primaryColor, 0.05)} 0%, ${alpha(primaryColor, 0.1)} 100%)`,
            border: `1px solid ${alpha(primaryColor, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <m.div variants={varFade().inLeft}>
                <Typography
                  variant="overline"
                  sx={{
                    color: primaryColor,
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  {t('Our Story')}
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{ fontWeight: 800, mt: 1, mb: 3, lineHeight: 1.1 }}
                >
                  {t('Since February 2021, at')} <br />
                  <Box component="span" sx={{ color: primaryColor }}>
                    {APP_NAME}
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  {t(
                    'We work for animal welfare. We are a Costa Rican family business born from a genuine need and the creative vision of a couple who saw a problem and committed to creating new possibilities.'
                  )}
                </Typography>
              </m.div>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <m.div variants={varFade().inRight}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 250, md: 350 },
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: `linear-gradient(45deg, ${primaryColor}, #E68A6B)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  }}
                >
                  <Logo sx={{ width: 100, height: 100 }} />
                </Box>
              </m.div>
            </Grid>
          </Grid>
        </Paper>

        {/* 2. PROBLEMA Y SOLUCIÓN */}
        <Grid container spacing={4} sx={{ mb: { xs: 8, md: 12 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <m.div variants={varFade().inUp}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  p: 2,

                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(primaryColor, 0.1),
                      color: primaryColor,
                      width: 56,
                      height: 56,
                      mb: 3,
                    }}
                  >
                    <Iconify icon="mdi:alert-circle-outline" width={32} />
                  </Avatar>
                  <Typography
                    variant="h4"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {t('The Problem That Moved Us')}
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                  >
                    {t(
                      'We have had to experience losing our pets, as well as watching loved ones suffer from the same situation. We felt that inexplicable mix of emotions: anguish, uncertainty, despair.'
                    )}
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                  >
                    {t(
                      'We could not accept that in 2021 pet identification was still scarce, tedious and subject to expiration dates, leaving our companions vulnerable.'
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </m.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <m.div variants={varFade().inUp}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  p: 2,

                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#4CAF50', 0.1),
                      color: '#4CAF50',
                      width: 56,
                      height: 56,
                      mb: 3,
                    }}
                  >
                    <Iconify icon="mdi:lightbulb-outline" width={32} />
                  </Avatar>
                  <Typography
                    variant="h4"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {t('The Solution We Believe In')}
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                  >
                    {t(
                      'We clearly saw that a more comprehensive, updated and permanent pet identification was not only possible, but absolutely necessary. With technology as an ally, we were able to provide a real and effective solution.'
                    )}
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                  >
                    {t(
                      'Thus our commitment was born: to revolutionize the way we protect our pets, making their safety accessible, modern and permanent.'
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </m.div>
          </Grid>
        </Grid>

        {/* 3. NUESTROS VALORES */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <m.div variants={varFade().inUp}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              fontWeight="800"
              sx={{ mb: 6 }}
            >
              {t('Our Core Values')}
            </Typography>
          </m.div>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <m.div variants={varFade().inUp}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 4,

                      textAlign: 'center',
                      p: 3,
                      border: '1px solid rgba(0,0,0,0.04)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                        borderColor: primaryColor,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: alpha(primaryColor, 0.08),
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Iconify icon={value.icon} width={32} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {t(value.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {t(value.description)}
                    </Typography>
                  </Card>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 4. LÍNEA DE TIEMPO (MILESTONES) */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <m.div variants={varFade().inUp}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              fontWeight="800"
              sx={{ mb: 8 }}
            >
              {t('Our Journey')}
            </Typography>
          </m.div>

          <Grid container spacing={4} justifyContent="center">
            {milestones.map((milestone, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <m.div variants={varFade().inUp}>
                  <Box sx={{ position: 'relative', textAlign: 'center' }}>
                    {/* Línea conectora (solo visible en desktop) */}
                    {index < milestones.length - 1 && (
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          position: 'absolute',
                          top: 40,
                          left: '50%',
                          width: '100%',
                          height: 2,
                          bgcolor: alpha(primaryColor, 0.2),
                          zIndex: 0,
                        }}
                      />
                    )}

                    {/* Icono Central */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',

                        border: `3px solid ${primaryColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Iconify
                        icon={milestone.icon}
                        width={36}
                        sx={{ color: primaryColor }}
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      fontWeight="800"
                      sx={{ color: primaryColor }}
                    >
                      {/^\d+$/.test(milestone.year)
                        ? milestone.year
                        : t(milestone.year)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                      {t(milestone.event, { appName: APP_NAME })}
                    </Typography>
                  </Box>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 5. CALL TO ACTION FINAL */}
        <m.div variants={varFade().inUp}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 5, md: 8 },
              borderRadius: 6,
              textAlign: 'center',
              background: `linear-gradient(135deg, #2B211D 0%, #4A2C22 100%)`, // Fondo oscuro elegante
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Adorno de fondo */}
            <Iconify
              icon="mdi:paw"
              sx={{
                position: 'absolute',
                top: -20,
                left: -20,
                fontSize: 200,
                color: 'white',
                opacity: 0.03,
                transform: 'rotate(-20deg)',
              }}
            />

            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha('#FFF', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
              }}
            >
              <Iconify
                icon="mdi:rocket-launch"
                sx={{ fontSize: 40, color: '#E68A6B' }}
              />
            </Box>

            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              fontWeight="800"
            >
              {t('The Future We Build Together')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.8,
                maxWidth: 800,
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              {t(
                'We have many challenges ahead and we are eager to overcome them. We continue to innovate, grow and improve to offer you the best solutions for the well-being of your pets.'
              )}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 2, color: '#E68A6B' }}
            >
              {t('Will you join us on this journey?')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.7, maxWidth: 600, mx: 'auto' }}
            >
              {t(
                "Together, let's make sure no pet gets lost and that all of them have the protection they deserve."
              )}
            </Typography>
          </Paper>
        </m.div>
      </Container>
    </Box>
  );
};

export default AboutUs;
