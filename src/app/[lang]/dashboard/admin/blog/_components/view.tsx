'use client';

import React from 'react';
import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import { Container } from '@mui/material';

export default function BlogPanelView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <div>Blog Panel Works</div>
      </RoleBasedGuard>
    </Container>
  );
}
