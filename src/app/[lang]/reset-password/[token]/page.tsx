// reset password view

import ModernResetPasswordView from '@/sections/auth-demo/modern/modern-reset-password';

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  return <ModernResetPasswordView token={token} />;
}
