import { Metadata } from 'next';

import { AccountView } from '@/sections/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Account Settings',
};

export default function AccountPage() {
  return <AccountView />;
}
