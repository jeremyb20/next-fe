import { Metadata } from 'next';

import VeterinaryViewPage from './_components/view';

export const metadata: Metadata = {
  title: 'Admin Veterinary Clinics',
};

export default function VeterinariesPage() {
  return <VeterinaryViewPage />;
}
