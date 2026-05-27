import { Metadata } from 'next';

import { SupabaseForgotPasswordView } from '@/sections/auth/supabase';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Supabase: Forgot Password',
};

export default function ForgotPasswordPage() {
  return <SupabaseForgotPasswordView />;
}
