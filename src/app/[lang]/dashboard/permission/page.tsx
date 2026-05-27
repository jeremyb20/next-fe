import { Metadata } from 'next';

import PermissionDeniedView from '@/sections/permission/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Permission Denied',
};

export default function PermissionDeniedPage() {
  return <PermissionDeniedView />;
}
