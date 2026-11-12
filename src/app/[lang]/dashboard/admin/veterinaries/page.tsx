import { Metadata } from 'next';

import VeterinariesView from './_components/view';

export const metadata: Metadata = {
  title: 'Admin Veterinary Clinics',
};

export default function VeterinariesPage() {
  return <VeterinariesView />;
}
