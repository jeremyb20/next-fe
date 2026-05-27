import { Metadata } from 'next';

import { FirebaseForgotPasswordView } from '@/sections/auth/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Firebase: Forgot Password',
};

export default function ForgotPasswordPage() {
  return <FirebaseForgotPasswordView />;
}
