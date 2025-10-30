'use client';

import { useManagerUser } from '@/src/hooks/use-manager-user';

import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import OverviewAppUser from './overview-app-user';
import OverviewAppAdmin from './overview-app-admin';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const settings = useSettingsContext();
  const { user } = useManagerUser();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {user.role === 'admin' && <OverviewAppAdmin />}
      {user.role === 'client' && <OverviewAppUser />}
    </Container>
  );
}
