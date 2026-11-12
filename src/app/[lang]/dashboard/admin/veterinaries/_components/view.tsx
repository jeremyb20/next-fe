'use client';

import { RoleBasedGuard } from '@/auth/guard';

import VeterinariesListView from './veterinaries-list-view';

export default function VeterinariesView() {
  return (
    <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
      <VeterinariesListView />
    </RoleBasedGuard>
  );
}
