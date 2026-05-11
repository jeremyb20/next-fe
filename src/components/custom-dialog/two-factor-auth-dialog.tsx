import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

import OtpDialog from './otp-dialog';

interface TwoFactorAuthDialogProps {
  open: boolean;
  method: 'app' | 'email' | null;
  qrCode?: string | null;
  cooldown: number;
  isResending: boolean;
  isVerifying: boolean;
  onVerify: (code: string) => void;
  onCancel: () => void;
  onResend?: () => void;
  actionType?: 'login' | 'reset' | 'disable';
}

export default function TwoFactorAuthDialog({
  open,
  method,
  qrCode,
  cooldown,
  isResending,
  isVerifying,
  onVerify,
  onCancel,
  onResend,
  actionType = 'login',
}: TwoFactorAuthDialogProps) {
  const { t } = useTranslation();

  const getTitle = () => {
    if (actionType === 'disable') return t('Disable Two-Factor Authentication');
    return t('Two-Factor Authentication Required');
  };

  const getInfoMessage = () => {
    if (actionType === 'disable') {
      return t(
        'Enter the 6-digit verification code from your authenticator app to disable 2FA.'
      );
    }

    if (method === 'app') {
      return t('Please enter the 6-digit code from your authenticator app');
    }

    return t('Please enter the verification code sent to your email');
  };

  const getConfirmLabel = () => {
    if (actionType === 'disable') return t('Disable 2FA');
    if (actionType === 'reset') return t('Verify & Reset Password');
    return t('Verify & Sign In');
  };

  const getDescription = () => {
    if (actionType === 'reset') {
      return t('Enter verification code to reset your password');
    }
    return undefined;
  };

  return (
    <OtpDialog
      open={open}
      title={getTitle()}
      infoMessage={getInfoMessage()}
      description={getDescription()}
      qrCode={qrCode}
      confirmLabel={getConfirmLabel()}
      isLoading={isVerifying}
      isResending={isResending}
      resendCooldown={cooldown}
      showResendButton={method === 'email'}
      onVerify={onVerify}
      onCancel={onCancel}
      onResend={onResend}
    />
  );
}
