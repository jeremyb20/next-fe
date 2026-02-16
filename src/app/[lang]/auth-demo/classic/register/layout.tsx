'use client';

import AuthClassicLayout from '@/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthClassicLayout title="Manage the job more effectively with Minimal">
      {children}
    </AuthClassicLayout>
  );
}
