'use client';

import { GuestGuard } from '@/auth/guard';
import SimpleLayout from '@/layouts/simple';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <SimpleLayout>{children}</SimpleLayout>
    </GuestGuard>
  );
}
