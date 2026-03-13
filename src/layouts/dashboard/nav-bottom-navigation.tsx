import { paths } from '@/routes/paths';
import { bgGradient } from '@/theme/css';
import Iconify from '@/components/iconify';
import SvgColor from '@/components/svg-color';
import { useLocales } from '@/locales/use-locales';
import React, { useMemo, useCallback } from 'react';
import { useRouter, usePathname } from '@/routes/hooks';

import {
  alpha,
  Paper,
  Badge,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';

import Searchbar from '../common/searchbar';

interface NavBottomNavigationProps {
  maxItems?: number;
  userRole?: string;
  notificationCount?: number;
}

interface NavRoute {
  path: string;
  icon: React.ReactNode;
  label?: string;
  type: 'iconify' | 'svg' | 'component';
  value?: string;
}

export const bottomNavRoutes: NavRoute[] = [
  {
    path: paths.dashboard.root,
    icon: 'solar:home-2-linear',
    label: 'Inicio',
    type: 'iconify',
  },
  {
    path: paths.dashboard.product.root,
    icon: '/assets/icons/navbar/ic_ecommerce.svg',
    label: 'Productos',
    type: 'svg',
  },
  {
    path: paths.dashboard.user.account,
    icon: 'solar:user-circle-linear',
    label: 'Perfil',
    type: 'iconify',
  },
  {
    path: '#search',
    icon: <Searchbar style={{ color: '#fff', padding: 0 }} />,
    label: 'Buscar',
    type: 'component',
  },
];

export default function NavBottomNavigation({
  maxItems = 5,
  userRole,
  notificationCount = 0,
}: NavBottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const { currentLang } = useLocales();

  const visibleRoutes = useMemo(() => {
    const routes = [...bottomNavRoutes];

    return routes.slice(0, maxItems);
  }, [maxItems]);

  const activeValue = useMemo(() => {
    const index = visibleRoutes.findIndex((route) => {
      // Si es la ruta de búsqueda, no la consideramos para match
      if (route.path === '#search') return false;

      const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

      const normalizedPath = pathWithoutLang || '/';

      if (route.path === paths.dashboard.root) {
        return (
          normalizedPath === paths.dashboard.root ||
          normalizedPath === '/' ||
          pathname === `/${currentLang}${paths.dashboard.root}` ||
          pathname === `/${currentLang}/`
        );
      }

      return (
        normalizedPath.startsWith(route.path) ||
        pathname.startsWith(`/${currentLang}${route.path}`)
      );
    });

    return index !== -1 ? index : 0; // Default a 0 si no encuentra match
  }, [currentLang, pathname, visibleRoutes]);

  const handleRedirect = useCallback(
    (redirectTo: string) => {
      if (redirectTo !== '#search') {
        router.push(redirectTo);
      }
    },
    [router]
  );

  const renderIcon = useCallback(
    (route: NavRoute) => {
      if (route.type === 'component' && typeof route.icon !== 'string') {
        return route.icon;
      }

      if (route.type === 'svg' && typeof route.icon === 'string') {
        return <SvgColor src={route.icon} sx={{ width: 0.6, height: 0.6 }} />;
      }

      if (route.type === 'iconify' && typeof route.icon === 'string') {
        if (route.path.includes('notifications') && notificationCount > 0) {
          return (
            <Badge badgeContent={notificationCount} color="error">
              <Iconify icon={route.icon} width={20} />
            </Badge>
          );
        }
        return <Iconify icon={route.icon} width={20} />;
      }

      return route.icon;
    },
    [notificationCount]
  );

  const handleActionClick = useCallback(
    (route: NavRoute) => {
      if (route.path === '#search') {
        console.log('Abrir buscador');
      } else {
        handleRedirect(route.path);
      }
    },
    [handleRedirect]
  );

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        display: { xs: 'block', md: 'none' },
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: theme.zIndex.appBar,
      }}
    >
      <BottomNavigation
        showLabels
        value={activeValue}
        onChange={(event, newValue) => {
          handleActionClick(visibleRoutes[newValue]);
        }}
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: alpha(PRIMARY_MAIN, 0.95),
            endColor: alpha(theme.palette.secondary.main, 0.85),
          }),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.1)}`,
          '& .MuiBottomNavigationAction-root': {
            color: alpha('#fff', 0.7),
            py: 1,
            transition: 'all 0.2s',
            '&.Mui-selected': {
              color: PRIMARY_MAIN,
              bgcolor: alpha('#fff', 0.95),
              borderRadius: 8,
              m: 0.5,
              '& .MuiSvgIcon-root': {
                color: PRIMARY_MAIN,
              },
            },
            '&:hover': {
              color: '#fff',
              bgcolor: alpha('#fff', 0.15),
              borderRadius: 8,
            },
          },
        }}
      >
        {visibleRoutes.map((route, index) => (
          <BottomNavigationAction
            key={`${route.path}-${index}`}
            label={route.label}
            icon={renderIcon(route)}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
