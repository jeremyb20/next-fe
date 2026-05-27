import { Metadata } from 'next';

import ChartView from '@/sections/_examples/extra/chart-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Chart',
};

export default function ChartPage() {
  return <ChartView />;
}
