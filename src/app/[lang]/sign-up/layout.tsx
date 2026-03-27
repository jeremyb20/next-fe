'use client';

import SimpleLayout from '@/layouts/simple';
import GuestGuard from '@/auth/guard/guest-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <SimpleLayout>{children}</SimpleLayout>;
    </GuestGuard>
  );
}
