import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// ----------------------------------------------------------------------
import { useTheme } from '@mui/material/styles';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { paper } from '@/theme/css';
import Logo from '@/components/logo';
import { usePathname } from '@/routes/hooks';
import Scrollbar from '@/components/scrollbar';
import { useResponsive } from '@/hooks/use-responsive';
import { useManagerUser } from '@/hooks/use-manager-user';
import { NavSectionVertical } from '@/components/nav-section';
import FeedbackButton from '@/components/feedback/FeedbackButton';

import { NAV } from '../config-layout';
import NavUpgrade from '../common/nav-upgrade';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useManagerUser();
  const theme = useTheme();
  const currentRole = user?.role;

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData(currentRole);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ my: 2, mx: 2 }}>
        <FeedbackButton />
      </Box>
      <NavUpgrade />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
          sx={{
            [`& .${drawerClasses.paper}`]: {
              ...paper({ theme, bgcolor: theme.palette.background.default }),
              width: 280,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
