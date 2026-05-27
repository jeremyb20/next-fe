import { Metadata } from 'next';

import MaintenanceView from '@/sections/maintenance/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Maintenance',
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
