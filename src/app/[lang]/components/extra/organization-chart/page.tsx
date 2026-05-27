import { Metadata } from 'next';

import OrganizationalChartView from '@/sections/_examples/extra/organizational-chart-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Organizational Chart',
};

export default function OrganizationalChartPage() {
  return <OrganizationalChartView />;
}
