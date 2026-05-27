import { Metadata } from 'next';

import { JobListView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Job List',
};

export default function JobListPage() {
  return <JobListView />;
}
