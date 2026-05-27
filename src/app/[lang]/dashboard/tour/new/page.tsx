import { Metadata } from 'next';

import { TourCreateView } from '@/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Create a new tour',
};

export default function TourCreatePage() {
  return <TourCreateView />;
}
