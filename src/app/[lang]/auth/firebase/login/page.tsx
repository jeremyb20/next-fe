import { Metadata } from 'next';

import { FirebaseLoginView } from '@/sections/auth/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Firebase: Login',
};

export default function LoginPage() {
  return <FirebaseLoginView />;
}
