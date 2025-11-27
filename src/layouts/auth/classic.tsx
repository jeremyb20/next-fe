import Stack from '@mui/material/Stack';
import { Box, Card } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';

import SettingsButton from '../common/settings-button';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderSection = (
    <Stack sx={{ position: 'relative' }}>
      <Box
        component="img"
        alt="auth"
        src="/assets/background/overlay_3.jpg"
        sx={{
          top: 16,
          left: 16,
          objectFit: 'cover',
          position: 'absolute',
          width: 'calc(100% - 32px)',
          height: 'calc(100% - 32px)',
        }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2 },
      }}
    >
      {mdUp && (
        <Logo
          sx={{
            mt: 8,
            mb: 8,
          }}
        />
      )}
      <Card
        sx={{
          py: { xs: 3, md: 5 },
          px: 3,
          boxShadow: 'none',
          bgcolor: 'background.default',
          overflow: 'unset',
          my: 3,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {!mdUp && <Logo sx={{ mb: 2 }} />}
          <SettingsButton
            sx={{
              ml: { xs: 1, md: 0 },
              mr: { md: 2 },
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          />
        </Stack>

        {children}
      </Card>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: 'absolute',
          backgroundSize: 'cover',
          // opacity: { xs: 0.24, md: 0 },
          opacity: 0.24,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: 'url(/assets/background/overlay_4.jpg)',
        },
      }}
    >
      {renderContent}

      {renderSection}
    </Stack>
  );
}
