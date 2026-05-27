import { Metadata } from 'next';

import ChipView from '@/sections/_examples/mui/chip-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Chip',
};

export default function ChipPage() {
  return <ChipView />;
}
