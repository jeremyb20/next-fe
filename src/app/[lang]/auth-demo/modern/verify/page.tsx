import { Metadata } from 'next';

import { ModernVerifyView } from '@/sections/auth-demo/modern';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Modern: Verify',
};

export default function ModernVerifyPage() {
  return <ModernVerifyView />;
}
