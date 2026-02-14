'use client';

import React from 'react';
import { RoleBasedGuard } from '@/src/auth/guard';

import UserListView from './view/user-list-view';

export default function UsersView() {
  return (
    <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
      <UserListView />
    </RoleBasedGuard>
  );
}
