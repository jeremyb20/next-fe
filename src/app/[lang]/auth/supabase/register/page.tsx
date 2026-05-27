import { Metadata } from 'next';

import { SupabaseRegisterView } from '@/sections/auth/supabase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Supabase: Register',
};

export default function RegisterPage() {
  return <SupabaseRegisterView />;
}
