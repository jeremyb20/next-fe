'use client';

import { Container } from '@mui/material';

import { RoleBasedGuard } from '@/auth/guard';
import { useSettingsContext } from '@/components/settings';

import PromotionsListView from './view/promotion-list-view';

export default function PromotionsView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoleBasedGuard hasContent roles={['admin']} sx={{ py: 10 }}>
        <PromotionsListView />
      </RoleBasedGuard>
    </Container>
  );
}
