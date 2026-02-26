import { paths } from '@/routes/paths';
import { bgGradient } from '@/theme/css';
import React, { useCallback } from 'react';
import { useRouter } from '@/routes/hooks';
import Iconify from '@/components/iconify';
import SvgColor from '@/components/svg-color';

import {
  alpha,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';

import Searchbar from '../common/searchbar';

export default function NavBottomNavigation() {
  const router = useRouter();
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const HandleRedirect = useCallback(
    (redirectTo: string) => {
      router.push(redirectTo);
    },
    [router]
  );
  return (
    <BottomNavigation
      showLabels={false}
      sx={{
        position: 'fixed',
        display: { xs: 'flex', md: 'none' },
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        ...bgGradient({
          direction: '1deg',
          startColor: alpha(PRIMARY_MAIN, 0.9),
          endColor: alpha(PRIMARY_MAIN, 0.6),
        }),

        borderRadius: 8,
        '& .MuiBottomNavigationAction-root': {
          color: '#fff',
          minWidth: 60,
        },
        '& .Mui-selected': {
          bgcolor: '#fff',
          color: '#000',
          borderRadius: '50%',
        },
      }}
    >
      <BottomNavigationAction
        onClick={() => HandleRedirect(paths.dashboard.root)}
        icon={<Iconify icon="solar:home-2-linear" />}
      />
      <BottomNavigationAction
        onClick={() => HandleRedirect(paths.dashboard.product.root)}
        icon={
          <SvgColor
            src="/assets/icons/navbar/ic_ecommerce.svg"
            sx={{ width: 0.6, height: 0.6 }}
          />
        }
      />
      <BottomNavigationAction icon={<Searchbar style={{ color: '#fff' }} />} />
    </BottomNavigation>
  );
}
