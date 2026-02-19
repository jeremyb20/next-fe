'use client';

import React from 'react';
import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import { Container } from '@mui/material';

export default function CatalogView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <h1>this works</h1>
      </RoleBasedGuard>
    </Container>
  );
}
