import { Metadata } from 'next';

import NavigationBarView from '@/sections/_examples/extra/navigation-bar-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Navigation Bar',
};

export default function NavigationBarPage() {
  return <NavigationBarView />;
}
