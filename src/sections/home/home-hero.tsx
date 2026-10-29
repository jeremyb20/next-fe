// import { m } from 'motion/react';
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import { alpha } from '@mui/material/styles';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';

// import Image from '@/components/image';
// import { paths } from '@/routes/paths';
// import Iconify from '@/components/iconify';
// import { RouterLink } from '@/routes/components';
// import { useTranslation } from '@/hooks/use-translation';
// import { varFade, MotionViewport } from '@/components/animate';

// export default function HomePetTags() {
//   const { t, lng } = useTranslation();

//   const renderImg = (
//     <Image
//       alt={t('Pet tags with QR code for your pet safety')}
//       src={`/assets/images/home/pet-tag-qr-${lng}.png`}
//       width="100%"
//       height={400}
//       sx={{
//         borderRadius: 2,
//         my: { xs: 5, md: 10 },
//         boxShadow: (theme) =>
//           `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
//         objectFit: 'contain',
//       }}
//     />
//   );

//   return (
//     <Box sx={{ bgcolor: 'background.neutral', py: { xs: 10, md: 15 } }}>
//       <Container component={MotionViewport}>
//         <Stack
//           spacing={5}
//           direction={{ xs: 'column', md: 'row' }}
//           alignItems="center"
//         >
//           {/* Columna izquierda - Texto */}
//           <Box sx={{ flex: 1 }}>
//             <m.div variants={varFade().inUp}>
//               <Typography variant="h2" component="h2" gutterBottom>
//                 {t('Smart Tags for Your Pet')}
//               </Typography>
//             </m.div>

//             <m.div variants={varFade().inUp}>
//               <Typography
//                 variant="h4"
//                 component="h3"
//                 color="text.secondary"
//                 paragraph
//               >
//                 {t('Protect your pet with our QR code identification tags')}
//               </Typography>
//             </m.div>

//             <Stack spacing={3}>
//               <m.div variants={varFade().inUp}>
//                 <Typography variant="h6" component="h4">
//                   • {t('Unique QR code for each pet')}
//                 </Typography>
//               </m.div>
//               <m.div variants={varFade().inUp}>
//                 <Typography variant="body1" component="p">
//                   • {t('Instant access to pet information')}
//                 </Typography>
//               </m.div>
//               <m.div variants={varFade().inUp}>
//                 <Typography variant="body1" component="p">
//                   • {t('Durable and weather-resistant materials')}
//                 </Typography>
//               </m.div>
//               <m.div variants={varFade().inUp}>
//                 <Typography variant="body1" component="p">
//                   • {t('Easy to register and update online')}
//                 </Typography>
//               </m.div>
//             </Stack>

//             <m.div variants={varFade().inUp}>
//               <Stack
//                 spacing={1.5}
//                 direction={{ xs: 'column-reverse', sm: 'row' }}
//                 sx={{ mt: 5 }}
//               >
//                 <Stack alignItems="center" spacing={2}>
//                   <Button
//                     component={RouterLink}
//                     href={paths.auth.signUp}
//                     size="large"
//                     variant="contained"
//                     startIcon={<Iconify icon="mdi:paw" width={24} />}
//                   >
//                     {t('Get Started')}
//                   </Button>
//                 </Stack>

//                 <Button
//                   color="inherit"
//                   size="large"
//                   variant="outlined"
//                   startIcon={<Iconify icon="mdi:vet" width={24} />}
//                   component={RouterLink}
//                   href={paths.auth.signIn}
//                 >
//                   {t('I have an account')}
//                 </Button>
//               </Stack>
//             </m.div>
//           </Box>

//           {/* Columna derecha - Imagen */}
//           <Box sx={{ flex: 1 }}>
//             <m.div variants={varFade().inUp}>{renderImg}</m.div>
//           </Box>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }

// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import { m, useScroll } from 'motion/react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import { alpha, styled } from '@mui/material/styles';
// import { useRef, useState, useEffect, useCallback } from 'react';

// import { paths } from '@/routes/paths';
// import Iconify from '@/components/iconify';
// import { APP_NAME } from '@/config-global';
// import { RouterLink } from '@/routes/components';
// import { HEADER } from '@/layouts/config-layout';
// import { bgGradient, textGradient } from '@/theme/css';
// import { useTranslation } from '@/hooks/use-translation';
// import { varFade, MotionContainer } from '@/components/animate';

// // ----------------------------------------------------------------------

// const StyledRoot = styled('div')(({ theme }) => ({
//   ...bgGradient({
//     color: alpha(
//       theme.palette.background.default,
//       theme.palette.mode === 'light' ? 0.9 : 0.94
//     ),
//     imgUrl: '/assets/background/overlay_5.jpg',
//   }),
//   width: '100%',
//   height: '100vh',
//   position: 'relative',
//   [theme.breakpoints.up('md')]: {
//     top: 0,
//     left: 0,
//     position: 'fixed',
//   },
// }));

// const StyledWrapper = styled('div')(({ theme }) => ({
//   height: '100%',
//   overflow: 'hidden',
//   position: 'relative',
//   [theme.breakpoints.up('md')]: {
//     marginTop: HEADER.H_DESKTOP_OFFSET,
//   },
// }));

// const StyledTextGradient = styled(m.h1)(({ theme }) => ({
//   ...textGradient(
//     `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.info.main} 75%, ${theme.palette.primary.main} 100%`
//   ),
//   padding: 0,
//   marginTop: 8,
//   lineHeight: 1,
//   fontWeight: 900,
//   marginBottom: 24,

//   textAlign: 'center',
//   backgroundSize: '400%',
//   fontSize: `${64 / 16}rem`,
//   fontFamily: theme.typography.fontSecondaryFamily,
//   [theme.breakpoints.up('md')]: {
//     fontSize: `${96 / 16}rem`,
//     letterSpacing: 8,
//   },
//   display: 'block', // ← IMPORTANTE
//   fontStyle: 'normal', // ← IMPORTANTE
// }));

// export default function HomeHero() {
//   const heroRef = useRef<HTMLDivElement | null>(null);
//   const { scrollY } = useScroll();
//   const [percent, setPercent] = useState(0);
//   const { t } = useTranslation();

//   const getScroll = useCallback(() => {
//     let heroHeight = 0;
//     if (heroRef.current) {
//       heroHeight = heroRef.current.offsetHeight;
//     }
//     scrollY.on('change', (scrollHeight) => {
//       const scrollPercent = (scrollHeight * 100) / heroHeight;
//       setPercent(Math.floor(scrollPercent));
//     });
//   }, [scrollY]);

//   useEffect(() => {
//     getScroll();
//   }, [getScroll]);

//   const opacity = 1 - percent / 100;
//   const hide = percent > 120;

//   const renderDescription = (
//     <Stack
//       alignItems="center"
//       justifyContent="center"
//       sx={{
//         height: 1,
//         mx: 'auto',
//         maxWidth: 480,
//         opacity: opacity > 0 ? opacity : 0,
//         mt: {
//           md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
//         },
//       }}
//     >
//       <m.div variants={varFade().in} initial={false}>
//         <Typography
//           component="h1"
//           variant="h1"
//           sx={{
//             textAlign: 'center',
//             fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
//             fontWeight: 700,
//             mb: 1,
//             color: 'text.primary',
//           }}
//         >
//           {t('The Complete App')} <br />
//           {t('for Caring for Your Pet')}
//         </Typography>
//       </m.div>

//       <m.div variants={varFade().in} initial={false}>
//         <StyledTextGradient
//           animate={{ backgroundPosition: '200% center' }}
//           transition={{
//             repeatType: 'reverse',
//             ease: 'linear',
//             duration: 20,
//             repeat: Infinity,
//           }}
//         >
//           {APP_NAME}
//         </StyledTextGradient>
//       </m.div>

//       <m.div variants={varFade().in} initial={false}>
//         <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
//           {t(
//             'Register up to 10 pets, manage their health, schedule appointments and enjoy exclusive discounts'
//           )}
//         </Typography>
//       </m.div>

//       <m.div variants={varFade().in} initial={false}>
//         <Stack
//           spacing={1.5}
//           direction={{ xs: 'column-reverse', sm: 'row' }}
//           sx={{ mb: 5 }}
//         >
//           <Stack alignItems="center" spacing={2}>
//             <Button
//               component={RouterLink}
//               href={paths.auth.signUp}
//               size="large"
//               variant="contained"
//               startIcon={<Iconify icon="mdi:paw" width={24} />}
//             >
//               {t('Get Started')}
//             </Button>
//           </Stack>

//           <Button
//             color="inherit"
//             size="large"
//             variant="outlined"
//             startIcon={<Iconify icon="mdi:vet" width={24} />}
//             component={RouterLink}
//             href={paths.auth.signIn}
//           >
//             {t('I have an account')}
//           </Button>
//         </Stack>
//       </m.div>
//     </Stack>
//   );

//   return (
//     <>
//       <StyledRoot
//         ref={heroRef}
//         sx={{
//           ...(hide && {
//             opacity: 0,
//           }),
//         }}
//       >
//         <StyledWrapper>
//           <Container component={MotionContainer} sx={{ height: 1 }}>
//             <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
//               <Grid size={{ xs: 12, md: 12 }}>{renderDescription}</Grid>
//             </Grid>
//           </Container>
//         </StyledWrapper>
//       </StyledRoot>

//       <Box sx={{ height: { md: '100vh' } }} />
//     </>
//   );
// }

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { m, useScroll } from 'motion/react';
import Divider from '@mui/material/Divider'; // Importamos Divider para las líneas
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import { useRef, useState, useEffect, useCallback } from 'react';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { HEADER } from '@/layouts/config-layout';
import { bgGradient, textGradient } from '@/theme/css';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import { varFade, MotionContainer } from '@/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(
      theme.palette.background.default,

      theme.palette.mode === 'light'
        ? 0.11
        : theme.breakpoints.down('md')
          ? 0.84
          : 0.94
    ),
    imgUrl: '/assets/background/overlay_5.jpg',
  }),
  width: '100%',
  height: theme.breakpoints.down('md') ? '120vh' : '100vh',
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

// Ajustamos el gradiente para que se vea naranja como en la imagen
const StyledTextGradient = styled(m.span)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  display: 'inline-block', // Para que fluya con el texto del título
  fontStyle: 'normal',
  fontWeight: 800,
}));

export default function HomeHero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const [percent, setPercent] = useState(0);
  const { t } = useTranslation();
  const settings = useSettingsContext();

  // MANTENEMOS TU LÓGICA DE SCROLL ORIGINAL
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
      // Alineación a la izquierda en desktop, centro en móvil
      alignItems={{ xs: 'center', md: 'flex-start' }}
      justifyContent="center"
      sx={{
        height: 1,
        mx: { xs: 'auto', md: 0 }, // Márgenes para pegarlo a la izquierda en desktop
        maxWidth: { xs: 480, md: 850 }, // Más ancho para el título grande
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
        textAlign: { xs: 'center', md: 'left' }, // Alineación del texto
      }}
    >
      {/* 1. TEXTO PEQUEÑO SUPERIOR */}
      <m.div variants={varFade().in} initial={false}>
        <Typography
          variant="body1"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: 1.5,
            mb: 2,
            display: 'block',
            fontSize: '1rem',
          }}
        >
          {t('Smart tags for your pet')}
        </Typography>
      </m.div>

      {/* 2. TÍTULO PRINCIPAL CON GRADIENTE */}
      <m.div variants={varFade().in} initial={false}>
        <Typography
          component="h1"
          variant="h1"
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            fontWeight: 800,
            mb: 3,
            color: 'common.white', // Texto blanco
            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' }, // Letras grandes
            lineHeight: 1.1,
            textShadow: '2px 4px 10px rgba(0,0,0,0.3)', // Sombra para legibilidad
          }}
        >
          {t('The safest way to')} <br />
          <StyledTextGradient
            animate={{ backgroundPosition: '200% center' }}
            transition={{
              repeatType: 'reverse',
              ease: 'linear',
              duration: 20,
              repeat: Infinity,
            }}
          >
            {t('come back home')}
          </StyledTextGradient>
        </Typography>
      </m.div>

      {/* 3. DESCRIPCIÓN */}
      <m.div variants={varFade().in} initial={false}>
        <Typography
          variant="body1"
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            py: 1,
            mb: 4,
            fontSize: '1.1rem',
            color: 'grey.200',
            maxWidth: '550px',
            lineHeight: 1.6,
          }}
        >
          {t(
            "QR tags with all your pet's important information. If lost, anyone can scan the code and contact you instantly."
          )}
        </Typography>
      </m.div>

      {/* 4. ICONOS CON DIVISORES */}
      <m.div variants={varFade().in} initial={false} style={{ width: '100%' }}>
        <Stack
          direction="row"
          spacing={{ xs: 1, md: 3 }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
            />
          }
          justifyContent={{ xs: 'center', md: 'flex-start' }}
          sx={{ mb: 5 }}
        >
          {/* Item 1 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon="mdi:shield-check-outline"
              width={28}
              sx={{ color: 'primary.main' }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'common.white',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                {t('Information')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.300' }}>
                {t('always available')}
              </Typography>
            </Box>
          </Stack>

          {/* Item 2 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon="mdi:timer-sand"
              width={28}
              sx={{ color: 'primary.main' }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'common.white',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                {t('Fast and')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.300' }}>
                {t('easy to scan')}
              </Typography>
            </Box>
          </Stack>

          {/* Item 3 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon="mdi:heart-outline"
              width={28}
              sx={{ color: 'primary.main' }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'common.white',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                {t('More security')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.300' }}>
                {t('for your pet')}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </m.div>

      {/* 5. BOTONES */}
      <m.div variants={varFade().in} initial={false}>
        <Stack
          spacing={1.5}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          sx={{ mb: 5 }}
        >
          <Stack alignItems="center" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.auth.signUp}
              size="large"
              variant="contained"
              startIcon={<Iconify icon="mdi:paw" width={24} />}
              sx={{ borderRadius: 50, px: 4 }}
            >
              {t('Get Started')}
            </Button>
          </Stack>

          <Button
            color="inherit"
            size="large"
            variant="outlined"
            // startIcon={<Iconify icon="mdi:play-circle-outline" width={24} />}
            startIcon={<Iconify icon="mdi:arrow-right" width={24} />}
            component={RouterLink}
            href={paths.auth.signIn}
            sx={{
              borderRadius: 50,
              px: 4,
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'common.white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {t('I have an account')}
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
          <Container
            component={MotionContainer}
            sx={{ height: 1 }}
            maxWidth={settings.themeStretch ? false : 'xl'}
          >
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              {/* Cambiamos a md: 7 para que ocupe la izquierda y deje espacio a la foto */}
              <Grid size={{ xs: 12, md: 8 }}>{renderDescription}</Grid>
            </Grid>
          </Container>
        </StyledWrapper>
      </StyledRoot>

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
