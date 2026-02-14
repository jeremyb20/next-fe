'use client';

import React from 'react';
import { RoleBasedGuard } from '@/src/auth/guard';

import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

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
