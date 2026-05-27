import { Metadata } from 'next';

import { ModernNewPasswordView } from '@/sections/auth-demo/modern';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Modern: New Password',
};

export default function ModernNewPasswordPage() {
  return <ModernNewPasswordView />;
}
