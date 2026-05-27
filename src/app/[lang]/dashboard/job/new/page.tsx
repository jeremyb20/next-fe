import { Metadata } from 'next';

import { JobCreateView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Create a new job',
};

export default function JobCreatePage() {
  return <JobCreateView />;
}
