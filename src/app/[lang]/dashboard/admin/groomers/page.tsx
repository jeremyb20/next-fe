import { Metadata } from 'next';

import GroomersView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Users',
};

export default function GroomersPage() {
  return <GroomersView />;
}
