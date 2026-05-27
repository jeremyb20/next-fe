// ----------------------------------------------------------------------

import { Metadata } from 'next';

import { AccountView } from '@/sections/account/view';

export const metadata: Metadata = {
  title: 'Dashboard: User Profile',
};

export default function UserProfilePage() {
  return <AccountView />;
}
