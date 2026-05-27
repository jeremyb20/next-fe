import { Metadata } from 'next';

import UsersView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Users',
};

export default function UsersPage() {
  return <UsersView />;
}
