import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

import OtpDialog from './otp-dialog';

interface EmailVerificationDialogProps {
  open: boolean;
  email: string;
  cooldown: number;
  isSending: boolean;
  isVerifying: boolean;
  onVerify: (code: string) => void;
  onCancel: () => void;
  onResend: () => void;
}

export default function EmailVerificationDialog({
  open,
  email,
  cooldown,
  isSending,
  isVerifying,
  onVerify,
  onCancel,
  onResend,
}: EmailVerificationDialogProps) {
  const { t } = useTranslation();

  return (
    <OtpDialog
      open={open}
      title={t('Email Verification Required')}
      infoMessage={t(
        'Please verify your email address before enabling Two-Factor Authentication'
      )}
      description={`${t('A verification code has been sent to:')} ${email}`}
      confirmLabel={t('Verify email')}
      isLoading={isVerifying}
      isResending={isSending}
      resendCooldown={cooldown}
      showResendButton
      onVerify={onVerify}
      onCancel={onCancel}
      onResend={onResend}
    />
  );
}
