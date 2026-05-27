import { Metadata } from 'next';

import { SupabaseLoginView } from '@/sections/auth/supabase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Supabase: Login',
};

export default function LoginPage() {
  return <SupabaseLoginView />;
}
