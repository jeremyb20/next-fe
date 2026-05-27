import { Metadata } from 'next';

import ProgressView from '@/sections/_examples/mui/progress-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'MUI: Progress',
};

export default function ProgressPage() {
  return <ProgressView />;
}
