'use client';

import React from 'react';
import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import { Container } from '@mui/material';

import { ProductListView } from './product/view';

export default function ProductView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <ProductListView />
      </RoleBasedGuard>
    </Container>
  );
}
