import { Metadata } from 'next';

import TabsView from '@/sections/_examples/mui/tabs-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Tabs',
};

export default function TabsPage() {
  return <TabsView />;
}
