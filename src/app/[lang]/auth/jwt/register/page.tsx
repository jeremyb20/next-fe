import { Metadata } from 'next';

import { JwtRegisterView } from '@/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Jwt: Register',
};

export default function RegisterPage() {
  return <JwtRegisterView />;
}
