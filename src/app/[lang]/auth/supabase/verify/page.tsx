import { Metadata } from 'next';

import { SupabaseVerifyView } from '@/sections/auth/supabase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Supabase: Verify',
};

export default function VerifyPage() {
  return <SupabaseVerifyView />;
}
