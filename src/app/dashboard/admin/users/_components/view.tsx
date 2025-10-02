'use client';

import React from 'react';
import { RoleBasedGuard } from '@/src/auth/guard';

import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

// import UsersList from './users-list';
import UserListView from './view/user-list-view';

export default function UsersView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        {/* <UsersList /> */}
        <UserListView />
      </RoleBasedGuard>
    </Container>
  );
}
