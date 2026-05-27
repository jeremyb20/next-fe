import { Metadata } from 'next';

import { FirebaseRegisterView } from '@/sections/auth/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Firebase: Register',
};

export default function RegisterPage() {
  return <FirebaseRegisterView />;
}
