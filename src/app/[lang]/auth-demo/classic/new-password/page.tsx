import { Metadata } from 'next';

import { ClassicNewPasswordView } from '@/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Classic: New Password',
};

export default function ClassicNewPasswordPage() {
  return <ClassicNewPasswordView />;
}
