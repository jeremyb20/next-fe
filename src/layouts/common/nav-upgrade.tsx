import { useSnackbar } from 'notistack';
import Iconify from '@/src/components/iconify';
import { useAuthContext } from '@/src/auth/hooks';
import { useRouter } from '@/src/routes/hooks/use-router';
import { useManagerUser } from '@/src/hooks/use-manager-user';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

// import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useManagerUser();
  const { logout } = useAuthContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName}
            sx={{ width: 48, height: 48 }}
          >
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>

          {/* <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label> */}
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          rel="noopener"
          onClick={() => handleLogout()}
        >
          Logout{' '}
          <Iconify icon="solar:login-2-linear" width={20} sx={{ ml: 1 }} />
        </Button>
      </Stack>
    </Stack>
  );
}
