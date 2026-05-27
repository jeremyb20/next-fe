import { Metadata } from 'next';

import { UserListView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: User List',
};

export default function UserListPage() {
  return <UserListView />;
}
