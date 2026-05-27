import { Metadata } from 'next';

import SwitchView from '@/sections/_examples/mui/switch-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Switch',
};

export default function SwitchPage() {
  return <SwitchView />;
}
