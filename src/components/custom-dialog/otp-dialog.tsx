import React from 'react';
import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';
import OtpInput from '@/components/custom-inputs/otp-input';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Stack,
  Alert,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface OtpDialogProps {
  open: boolean;
  title: string;
  description?: string;
  infoMessage?: string;
  qrCode?: string | null;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isResending?: boolean;
  resendCooldown?: number;
  showResendButton?: boolean;
  onVerify: (code: string) => void;
  onCancel: () => void;
  onResend?: () => void;
  onClose?: () => void;
}

export default function OtpDialog({
  open,
  title,
  description,
  infoMessage,
  qrCode,
  confirmLabel = 'Verify & Continue',
  cancelLabel = 'Cancel',
  isLoading = false,
  isResending = false,
  resendCooldown = 0,
  showResendButton = false,
  onVerify,
  onCancel,
  onResend,
  onClose,
}: OtpDialogProps) {
  const { t } = useTranslation();
  const [otpCode, setOtpCode] = React.useState('');

  const handleVerify = () => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
      setOtpCode('');
    }
  };

  const handleCancel = () => {
    setOtpCode('');
    onCancel();
  };

  const handleClose = (event: {}, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setOtpCode('');
      if (onClose) {
        onClose();
      } else {
        onCancel();
      }
    }
  };

  const formatCooldownTime = (seconds: number): string => {
    if (seconds <= 0) return '';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResendIcon = () => {
    if (isResending) return <Box sx={{ width: 16, height: 16 }} />;
    if (resendCooldown > 0)
      return <Iconify icon="solar:clock-circle-bold" width={16} />;
    return <Iconify icon="solar:refresh-bold" width={16} />;
  };

  const getResendLabel = () => {
    if (isResending) return t('Sending...');
    if (resendCooldown > 0)
      return `${t('Resend code')} (${formatCooldownTime(resendCooldown)})`;
    return t('Resend code');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:shield-keyhole-bold" width={28} />
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {infoMessage && <Alert severity="info">{infoMessage}</Alert>}

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {description}
            </Typography>
          )}

          {qrCode && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <img
                src={qrCode}
                alt="QR Code"
                style={{ width: 200, height: 200 }}
              />
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {t('Scan this QR code with your authenticator app')}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {t('Then enter the 6-digit code below')}
              </Typography>
            </Box>
          )}

          <OtpInput
            onChange={(code) => setOtpCode(code)}
            onEnter={() => {
              if (otpCode.length === 6) handleVerify();
            }}
          />

          {showResendButton && onResend && (
            <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={onResend}
                disabled={isResending || resendCooldown > 0}
                startIcon={getResendIcon()}
              >
                {getResendLabel()}
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <LoadingButton
          onClick={handleVerify}
          variant="contained"
          loading={isLoading}
          disabled={otpCode.length !== 6}
        >
          {confirmLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
