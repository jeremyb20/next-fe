import { Metadata } from 'next';

import { OverviewAppView } from '@/sections/overview/app/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Welcome',
};

export default function OverviewAppPage() {
  return <OverviewAppView />;
}
