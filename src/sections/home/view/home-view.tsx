'use client';

import Box from '@mui/material/Box';
import { useScroll } from 'motion/react';
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
import HomeFeatures from '../home-features';
import HomeServices from '../home-services';
import HomePetTracking from '../home-pet-tracking';
import HomeScanPreview from '../home-scan-preview';
import HomeTestimonials from '../home-testimonials';

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

        {/* <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeServices />
          <StyledPolygon anchor="bottom" />
        </Box> */}
        <HomeServices />

        {/* <HomeGrooming /> */}
        <HomeScanPreview />
        {/* <HomeLostPets /> */}
        {/* <HomeVeterinarians /> */}

        {/* <HomeShop /> */}

        {/* <HomePricing /> */}

        <HomeTestimonials />

        {/* <HomeBlog /> */}
        <GoogleAd slot="5393711295" />
      </Box>
    </MainLayout>
  ) : (
    <SplashScreen />
  );
}
