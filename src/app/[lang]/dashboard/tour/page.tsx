import { Metadata } from 'next';

import { TourListView } from '@/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Tour List',
};

export default function TourListPage() {
  return <TourListView />;
}
