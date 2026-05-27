import { Metadata } from 'next';

import { ClassicVerifyView } from '@/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Classic: Verify',
};

export default function ClassicVerifyPage() {
  return <ClassicVerifyView />;
}
