'use client';

import React from 'react';
import { Container } from '@mui/material';

import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

export default function GroomersView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <div>Gromers works</div>
      </RoleBasedGuard>
    </Container>
  );
}
