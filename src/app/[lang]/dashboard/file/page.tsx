import { Metadata } from 'next';

import { OverviewFileView } from '@/sections/overview/file/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: File',
};

export default function OverviewFilePage() {
  return (
    <>
      <OverviewFileView />;
    </>
  );
}
