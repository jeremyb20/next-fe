import { Metadata } from 'next';

import MegaMenuView from '@/sections/_examples/extra/mega-menu-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Components: Mega Menu',
};

export default function MegaMenuPage() {
  return <MegaMenuView />;
}
