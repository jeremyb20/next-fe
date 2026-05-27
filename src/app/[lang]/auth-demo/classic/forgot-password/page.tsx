import { Metadata } from 'next';

import { ClassicForgotPasswordView } from '@/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Classic: Forgot Password',
};

export default function ClassicForgotPasswordPage() {
  return <ClassicForgotPasswordView />;
}
