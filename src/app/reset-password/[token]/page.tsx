// reset password view

import ModernResetPasswordView from '@/src/sections/auth-demo/modern/modern-reset-password';

type Props = {
  params: {
    token: string;
  };
};

export default function ResetPasswordPage({ params }: Props) {
  const { token } = params;
  return <ModernResetPasswordView token={token} />;
}
