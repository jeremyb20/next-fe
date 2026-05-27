import { Metadata } from 'next';

import { OverviewAnalyticsView } from '@/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Analytics',
};

export default function OverviewAnalyticsPage() {
  return <OverviewAnalyticsView />;
}
