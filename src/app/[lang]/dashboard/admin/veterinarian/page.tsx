import { Metadata } from 'next';

import VeterinarianView from './_components/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Admin Users',
};

export default function VeterinarianPage() {
  return <VeterinarianView />;
}
