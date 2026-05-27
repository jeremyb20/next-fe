import { Metadata } from 'next';

import { JwtLoginView } from '@/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Login Page',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
