import { Metadata } from 'next';

import TooltipView from '@/sections/_examples/mui/tooltip-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Tooltip',
};

export default function TooltipPage() {
  return <TooltipView />;
}
