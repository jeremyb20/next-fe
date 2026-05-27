import { Metadata } from 'next';

import { SupabaseNewPasswordView } from '@/sections/auth/supabase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Supabase: New Password',
};

export default function NewPasswordPage() {
  return <SupabaseNewPasswordView />;
}
