'use client';

import { _userCards } from '@/_mock';
import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { RouterLink } from '@/routes/components';

import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';

import UserCardList from '../user-card-list';

// ----------------------------------------------------------------------

export default function UserPetCardsView() {
  return (
    <Box>
      <Stack direction="column" sx={{ mb: { xs: 3, md: 5 } }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.user.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Pet
        </Button>
      </Stack>

      <UserCardList users={_userCards} />
    </Box>
  );
}
