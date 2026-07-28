'use client';

import Box from '@mui/material/Box';
import { useScroll } from 'motion/react';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useCallback } from 'react';

import { paths } from '@/routes/paths';
import MainLayout from '@/layouts/main';
import { useSearchParams } from '@/routes/hooks';
import GoogleAd from '@/components/adds/GoogleAd';
import { useRouter } from '@/routes/hooks/use-router';
import ScrollProgress from '@/components/scroll-progress';
import { SplashScreen } from '@/components/loading-screen';
import { useAuthContext } from '@/auth/hooks/use-auth-context';

import HomeHero from '../home-hero';
import HomeShop from '../home-shop';
import HomeFeatures from '../home-features';
import HomeServices from '../home-services';
import HomeLostPets from '../home-lost-pets';
import HomePetTracking from '../home-pet-tracking';
import HomeTestimonials from '../home-testimonials';

// ----------------------------------------------------------------------

type StyledPolygonProps = {
  anchor?: 'top' | 'bottom';
};

const StyledPolygon = styled('div')<StyledPolygonProps>(
  ({ anchor = 'top', theme }) => ({
    left: 0,
    zIndex: 9,
    height: 80,
    width: '100%',
    position: 'absolute',
    clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
    backgroundColor: theme.palette.background.default,
    display: 'block',
    lineHeight: 0,
    ...(anchor === 'top' && {
      top: -1,
      transform: 'scale(-1, -1)',
    }),
    ...(anchor === 'bottom' && {
      bottom: -1,
      backgroundColor: theme.palette.grey[900],
    }),
  })
);

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo') || paths.dashboard.root;

  const { authenticated } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(returnTo);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeFeatures />

        <HomePetTracking />

        <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeServices />
          <StyledPolygon anchor="bottom" />
        </Box>

        {/* <HomeGrooming /> */}

        <HomeLostPets />
        {/* <HomeVeterinarians /> */}

        <HomeShop />

        {/* <HomePricing /> */}

        <HomeTestimonials />

        {/* <HomeBlog /> */}
        <GoogleAd slot="" />
      </Box>
    </MainLayout>
  ) : (
    <SplashScreen />
  );
}
