'use client';

import React from 'react';
import { Container } from '@mui/material';

import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import QrCodeListView from './view/qrcode-list-view';

export default function QrPanelView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <QrCodeListView />
      </RoleBasedGuard>
    </Container>
  );
}
