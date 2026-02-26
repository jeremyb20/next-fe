'use client';

import React from 'react';
import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';
import NotificationsPopover from '@/layouts/common/notifications-popover';

import { Container } from '@mui/material';

export default function NotificationsPanelView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin', 'user']} sx={{ py: 10 }}>
        <div>Notifications Panel Works</div>
        <NotificationsPopover />
      </RoleBasedGuard>
    </Container>
  );
}
