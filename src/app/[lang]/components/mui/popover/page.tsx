import { Metadata } from 'next';

import PopoverView from '@/sections/_examples/mui/popover-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Popover',
};

export default function PopoverPage() {
  return <PopoverView />;
}
