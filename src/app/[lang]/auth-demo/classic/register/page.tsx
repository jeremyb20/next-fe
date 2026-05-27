import { Metadata } from 'next';

import { ClassicRegisterView } from '@/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Auth Classic: Register',
};

export default function ClassicRegisterPage() {
  return <ClassicRegisterView />;
}
