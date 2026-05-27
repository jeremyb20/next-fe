import { Metadata } from 'next';

import { OverviewBankingView } from '@/sections/overview/booking/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Booking',
};

export default function OverviewBookingPage() {
  return <OverviewBankingView />;
}
