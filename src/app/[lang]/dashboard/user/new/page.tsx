import { Metadata } from 'next';

import { UserCreateView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: Create a new user',
};

export default function UserCreatePage() {
  return <UserCreateView />;
}
