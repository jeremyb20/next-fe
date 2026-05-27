import { Metadata } from 'next';

import { OverviewBankingView } from '@/sections/overview/banking/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Banking',
};

export default function OverviewBankingPage() {
  return <OverviewBankingView />;
}
