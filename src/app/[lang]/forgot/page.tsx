// ----------------------------------------------------------------------

import { Metadata } from 'next';

import { ModernForgotPasswordView } from '@/sections/auth-demo/modern';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function Page() {
  return <ModernForgotPasswordView />;
}
