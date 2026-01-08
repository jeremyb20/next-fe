import { m, useScroll } from 'framer-motion';
import { APP_NAME } from '@/src/config-global';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from 'src/layouts/config-layout';
import { bgGradient, textGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(
      theme.palette.background.default,
      theme.palette.mode === 'light' ? 0.9 : 0.94
    ),
    imgUrl: '/assets/background/overlay_3.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
}));

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.info.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  fontWeight: 900,
  marginBottom: 24,

  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${64 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
    letterSpacing: 8,
  },
}));

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const [percent, setPercent] = useState(0);

  const getScroll = useCallback(() => {
    let heroHeight = 0;
    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }
    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;
      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const opacity = 1 - percent / 100;
  const hide = percent > 120;

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        mx: 'auto',
        maxWidth: 480,
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            color: 'common.white',
          }}
        >
          La App Completa <br />
          para el Cuidado de tu Mascota
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledTextGradient
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          {APP_NAME}
        </StyledTextGradient>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', py: 2, color: 'common.white' }}
        >
          Registra hasta 10 mascotas, gestiona su salud, agenda citas y disfruta
          de descuentos exclusivos
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack
          spacing={1.5}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          sx={{ mb: 5 }}
        >
          <Stack alignItems="center" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.auth.register}
              color="primary"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="mdi:paw" width={24} />}
            >
              Comenzar Ahora
            </Button>

            {/* <Link
              component={RouterLink}
              href={paths.auth.login}
              variant="caption"
              sx={{
                color: 'common.white',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Iconify icon="mdi:login" width={16} sx={{ mr: 0.5 }} />
              Ya tengo cuenta
            </Link> */}
          </Stack>

          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="mdi:vet" width={24} />}
            component={RouterLink}
            href={paths.auth.login}
            sx={{ borderColor: 'common.white', color: 'common.white' }}
          >
            {/* Soy Veterinario */}
            Ya tengo cuenta
          </Button>
        </Stack>
      </m.div>
    </Stack>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              <Grid xs={12} md={12}>
                {renderDescription}
              </Grid>

              {/* {mdUp && (
                <Grid md={6}>
                  <Box
                    component={m.img}
                    variants={varFade().in}
                    src="https://res.cloudinary.com/ensamble/image/upload/v1617140707/ni3pp5dtrusbht2tu7ht.jpg"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </Grid>
              )} */}
            </Grid>
          </Container>
        </StyledWrapper>
      </StyledRoot>

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
