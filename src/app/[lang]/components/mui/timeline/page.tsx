import { Metadata } from 'next';

import TimelineView from '@/sections/_examples/mui/timeline-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Timeline',
};

export default function TimelinePage() {
  return <TimelineView />;
}
