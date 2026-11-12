'use client';

import { RoleBasedGuard } from '@/auth/guard';

import VeterinaryDashboardView from './veterinary-dashboard-view';

export default function VeterinaryViewPage() {
  return (
    <RoleBasedGuard
      hasContent
      roles={['veterinarian', 'admin']}
      sx={{ py: 10 }}
    >
      <VeterinaryDashboardView />
    </RoleBasedGuard>
  );
}
