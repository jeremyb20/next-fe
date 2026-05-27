import { Metadata } from 'next';

import BadgeView from '@/sections/_examples/mui/badge-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Badge',
};

export default function BadgePage() {
  return <BadgeView />;
}
