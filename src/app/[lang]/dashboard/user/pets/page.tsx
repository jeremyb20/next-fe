import { Metadata } from 'next';

import UserPetCardsView from '../_components/user-pets-cards-view';

export const metadata: Metadata = {
  title: 'Dashboard: My Pets ',
};

export default function Page() {
  return <UserPetCardsView />;
}
