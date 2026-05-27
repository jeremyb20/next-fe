'use client';

import { Container } from '@mui/material';

import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';
import NotificationsPopover from '@/layouts/common/notifications-popover';

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
