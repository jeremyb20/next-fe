import { Metadata } from 'next';

import { ModernLoginView } from '@/sections/auth-demo/modern';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Modern: Login',
};

export default function ModernLoginPage() {
  return <ModernLoginView />;
}
