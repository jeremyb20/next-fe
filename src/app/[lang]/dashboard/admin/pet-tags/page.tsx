import { Metadata } from 'next';

import PetTagAdminView from './_components/view';

export const metadata: Metadata = {
  title: 'Admin Pet Tags',
};

export default function PetTagsPage() {
  return <PetTagAdminView />;
}
