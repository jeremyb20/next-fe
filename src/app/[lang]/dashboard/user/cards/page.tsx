import { Metadata } from 'next';

import { UserCardsView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: User Cards',
};

export default function UserCardsPage() {
  return <UserCardsView />;
}
