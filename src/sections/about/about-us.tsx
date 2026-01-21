import React from 'react';
import { APP_NAME } from '@/src/config-global';
import Iconify from '@/src/components/iconify';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const values = [
    {
      icon: <Iconify icon="ic:outline-pets" sx={{ fontSize: 40 }} />,
      title: 'Animal Welfare',
      description: 'Our purpose is to care for and protect pets.',
    },
    {
      icon: <Iconify icon="ic:outline-family-restroom" sx={{ fontSize: 40 }} />,
      title: 'Family Origin',
      description: 'Costa Rican family business with rooted values.',
    },
    {
      icon: <Iconify icon="ic:outline-update" sx={{ fontSize: 40 }} />,
      title: 'Constant Innovation',
      description: 'Updated technology for permanent solutions.',
    },
    {
      icon: <Iconify icon="ic:outline-groups" sx={{ fontSize: 40 }} />,
      title: 'Community',
      description: 'We grew thanks to the trust of thousands of families.',
    },
  ];

  const milestones = [
    { year: '2021', event: `Birth of ${APP_NAME}` },
    { year: '2021', event: 'Launch of Smart Tags' },
    { year: 'Actually', event: 'More than 5,000 pets protected' },
    { year: 'Next', event: 'New solutions in development' },
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
              {t('Our Story')}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              {t('Since February 2021, at')} {APP_NAME}{' '}
              {t('we have been working for animal welfare.')}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              {t(
                'We are a Costa Rican family business that was born out of a genuine need and the creative vision of a couple who saw a problem and committed themselves to creating new possibilities.'
              )}
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
                    {t('The Problem that Moved Us')}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {t(
                    'We have had to live through the experience of losing our pets, as well as seeing loved ones suffer from the same situation. We feel that inexplicable mix of emotions: anguish, uncertainty, despair.'
                  )}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {t(
                    'We could not accept that in 2021, pet identification continued to be scarce, tedious, and subject to expiration dates, leaving our companions vulnerable. life.'
                  )}
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
                    {t('The Solution We Believe In')}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {t(
                    'We clearly saw that more comprehensive, up-to-date, and permanent pet identification was not only possible but absolutely necessary. With technology as our ally, we could provide a real and effective solution.'
                  )}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {t(
                    'This is how our commitment was born: to revolutionize the way we protect our pets, making their safety accessible, modern, and permanent.'
                  )}
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
          {t('Our Journey')}
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
                {t('The Beginning')}
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {t(
                  'We began to assemble the small but mighty team that, to this day, remains the heart of our company. We dedicated months of intense work, research, and development to launch'
                )}
                {APP_NAME} {t('with our first product: the')}{' '}
                <strong>{t('Smart Tags')}</strong>.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                {t('Growth')}
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {t(
                  'Thanks to the beautiful community that trusted us from the very beginning, we have been able to grow and expand our services. Today, we are proud to offer a complete app that goes beyond pet identification, providing comprehensive care solutions.'
                )}
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
          {t('Our Core Values')}
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
                    {t(value.title)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(value.description)}
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
          {t('Our Milestones')}
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
                    {t(milestone.year)}
                  </Typography>
                  <Typography variant="body1">{t(milestone.event)}</Typography>
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
          {t('The Future We Build Together')}
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
          {t(
            'We have many challenges ahead of us and we are eager to overcome them. We continue to innovate, grow, and improve in order to offer you the best solutions for the well-being of your pets.'
          )}
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          {t('Will you join us on this journey?')}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          {t(
            'Together, lets make sure no pet gets lost and that they all have the protection they deserve.'
          )}
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutUs;
