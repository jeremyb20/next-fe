import { Metadata } from 'next';

import { ModernRegisterView } from '@/sections/auth-demo/modern';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Modern: Register',
};

export default function ModernRegisterPage() {
  return <ModernRegisterView />;
}
