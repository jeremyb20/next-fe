import { Metadata } from 'next';

import AlertView from '@/sections/_examples/mui/alert-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Alert',
};

export default function AlertPage() {
  return <AlertView />;
}
