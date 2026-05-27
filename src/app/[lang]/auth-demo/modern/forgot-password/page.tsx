import { Metadata } from 'next';

import { ModernForgotPasswordView } from '@/sections/auth-demo/modern';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Modern: Forgot Password',
};

export default function ModernForgotPasswordPage() {
  return <ModernForgotPasswordView />;
}
