import { Metadata } from 'next';

import MenuView from '@/sections/_examples/mui/menu-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Menu',
};

export default function MenuPage() {
  return <MenuView />;
}
