'use client';

import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';

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
