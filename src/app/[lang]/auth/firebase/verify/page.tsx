import { Metadata } from 'next';

import { FirebaseVerifyView } from '@/sections/auth/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Firebase: Verify',
};

export default function VerifyPage() {
  return <FirebaseVerifyView />;
}
