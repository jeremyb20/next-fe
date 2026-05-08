'use client';

import * as Yup from 'yup';
import { paths } from '@/routes/paths';
import { useForm } from 'react-hook-form';
import { endpoints } from '@/utils/axios';
import Iconify from '@/components/iconify';
import { HOST_API } from '@/config-global';
import { useState, useEffect } from 'react';
import { RouterLink } from '@/routes/components';
import { useSnackbar } from '@/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import EmptyContent from '@/components/empty-content';
import { useTranslation } from '@/hooks/use-translation';
import { useGetSecurityConfig } from '@/hooks/use-fetch';
import OtpInput from '@/components/custom-inputs/otp-input';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { LinearProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ----------------------------------------------------------------------

interface Device {
  id: string;
  name: string;
  location: string;
  lastActive: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

interface TwoFactorStatus {
  enabled: boolean;
  method: 'app' | 'email' | null;
  email: string;
  phone: string;
}

// ----------------------------------------------------------------------

export default function AccountSecurity() {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();
  const { t } = useTranslation();

  // Usar el custom hook para obtener datos de seguridad
  const {
    data: securityData,
    isError,
    error: ErrorData,
    isFetching,
    refetch: refetchSecurity,
  } = useGetSecurityConfig();

  const [showAuthAppSetup, setShowAuthAppSetup] = useState(false);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [pendingMethod, setPendingMethod] = useState<'app' | 'email' | null>(
    null
  );
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  const [showDisable2FADialog, setShowDisable2FADialog] = useState(false);
  const [disable2FACode, setDisable2FACode] = useState('');
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  // Extraer datos del securityData - CORREGIDO
  // Como los datos vienen en securityData.payload directamente
  const twoFactorStatus: TwoFactorStatus = {
    enabled: securityData?.twoFactor?.enabled || false,
    method: securityData?.twoFactor?.method || null,
    email: securityData?.twoFactor?.email || '',
    phone: securityData?.twoFactor?.phone || '',
  };

  const devices: Device[] = securityData?.devices || [];

  const twoFactorSchema = Yup.object().shape({
    backupEmail: Yup.string().email(t('Invalid email')),
  });

  const defaultValues = {
    backupEmail: twoFactorStatus.email,
  };

  const methods = useForm({
    resolver: yupResolver(twoFactorSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Actualizar formulario cuando cambian los datos
  useEffect(() => {
    if (securityData?.twoFactor?.email) {
      reset({ backupEmail: securityData.twoFactor.email });
    }
  }, [securityData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await mutateAsync({
        payload: {
          backupEmail: data.backupEmail,
        },
        pEndpoint: `${HOST_API}${endpoints.user.updateSecurityConfig}`,
        method: 'PUT',
      });

      if (response.success) {
        enqueueSnackbar(t('Security settings updated successfully!'), {
          variant: 'success',
        });
        // Refrescar datos
        await refetchSecurity();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error updating security settings'), {
        variant: 'error',
      });
    }
  });

  const handleEnable2FA = async (method: 'app' | 'email') => {
    try {
      setIsEnabling2FA(true);
      setPendingMethod(method);

      const response = await mutateAsync({
        payload: { method },
        pEndpoint: `${HOST_API}${endpoints.user.enable2FA}`,
        method: 'POST',
      });

      if (response.success) {
        if (response.payload.requiresVerification) {
          // Para email, mostrar diálogo de verificación
          setShowVerificationDialog(true);
        } else if (response.payload.qrCode && response.payload.secret) {
          // Para app, mostrar QR y luego solicitar verificación
          setQrCode(response.payload.qrCode);
          setTwoFactorSecret(response.payload.secret);
          setShowVerificationDialog(true);
        }
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || t('Error enabling 2FA'),
        {
          variant: 'error',
        }
      );
      setPendingMethod(null);
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || !pendingMethod) {
      enqueueSnackbar(t('Please enter verification code'), {
        variant: 'warning',
      });
      return;
    }

    try {
      const payload: any = {
        code: verificationCode,
        method: pendingMethod,
      };

      if (pendingMethod === 'app' && twoFactorSecret) {
        payload.secret = twoFactorSecret;
      }

      // Primero verificar el código
      const verifyResponse = await mutateAsync({
        payload,
        pEndpoint: `${HOST_API}${endpoints.user.verify2FACode}`,
        method: 'POST',
      });

      if (verifyResponse.success) {
        // Si la verificación es exitosa, completar la habilitación
        const enableResponse = await mutateAsync({
          payload: {
            method: pendingMethod,
            verificationCode,
            secret: twoFactorSecret,
          },
          pEndpoint: `${HOST_API}${endpoints.user.enable2FA}`,
          method: 'POST',
        });

        if (enableResponse.success) {
          // Refrescar datos de seguridad
          await refetchSecurity();

          setShowVerificationDialog(false);
          setShowAuthAppSetup(false);
          setShowEmailSetup(false);
          setVerificationCode('');
          setQrCode(null);
          setTwoFactorSecret(null);
          setPendingMethod(null);

          enqueueSnackbar(
            t('Two-factor authentication enabled via {{via}}', {
              via: pendingMethod === 'app' ? 'Authenticator App' : 'Email',
            }),
            { variant: 'success' }
          );
        }
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || t('Invalid verification code'),
        {
          variant: 'error',
        }
      );
    }
  };

  const handleDisable2FA = async () => {
    // Mostrar diálogo para ingresar el código
    setShowDisable2FADialog(true);
  };

  const handleConfirmDisable2FA = async () => {
    if (!disable2FACode) {
      enqueueSnackbar(t('Please enter verification code'), {
        variant: 'warning',
      });
      return;
    }

    try {
      setIsDisabling2FA(true);

      const response = await mutateAsync({
        payload: {
          verificationCode: disable2FACode,
          method: twoFactorStatus.method, // 'app' o 'email'
        },
        pEndpoint: `${HOST_API}${endpoints.user.disable2FA}`,
        method: 'POST',
      });

      if (response.success) {
        // Refrescar datos de seguridad
        await refetchSecurity();

        enqueueSnackbar(t('Two-factor authentication disabled'), {
          variant: 'success',
        });

        // Limpiar y cerrar diálogo
        setShowDisable2FADialog(false);
        setDisable2FACode('');
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || t('Error disabling 2FA'),
        { variant: 'error' }
      );
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleSignOutFromAllDevices = async () => {
    try {
      const response = await mutateAsync({
        pEndpoint: `${HOST_API}${endpoints.user.signOutAllDevices}`,
        method: 'POST',
        payload: {},
      });

      if (response.success) {
        // Refrescar datos de seguridad
        await refetchSecurity();

        enqueueSnackbar(t('Signed out from all devices'), {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error signing out from devices'), {
        variant: 'error',
      });
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      const response = await mutateAsync({
        pEndpoint: `${HOST_API}${endpoints.user.removeDevice}/${deviceId}`,
        method: 'DELETE',
        payload: {},
      });

      if (response.success) {
        // Refrescar datos de seguridad
        await refetchSecurity();

        enqueueSnackbar(t('Device removed successfully'), {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error removing device'), { variant: 'error' });
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await mutateAsync({
        pEndpoint: `${HOST_API}${endpoints.user.resend2FACode}`,
        method: 'POST',
        payload: {},
      });

      if (response.success) {
        enqueueSnackbar(t('New verification code sent to your email'), {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error sending verification code'), {
        variant: 'error',
      });
    }
  };

  const get2FAMethodLabel = (method: TwoFactorStatus['method']) => {
    if (method === 'app') return t('Authenticator App');
    if (method === 'email') return t('Email address');
    return '';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return 'solar:smartphone-bold';
      case 'tablet':
        return 'solar:tablet-bold';
      default:
        return 'solar:laptop-bold';
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title={`${t(ErrorData?.message || 'Error loading security settings')}`}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            {t('Back to dashboard')}
          </Button>
        }
        sx={{ py: 10 }}
      />
    );
  }

  return (
    <Stack spacing={3}>
      {/* 2FA Section */}
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack>
            <Typography variant="h6">
              {t('Two-factor Authentication')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Add an extra layer of security to your account')}
            </Typography>
          </Stack>
          {twoFactorStatus.enabled ? (
            <Button
              variant="contained"
              color="error"
              onClick={handleDisable2FA} // ← Esto ahora abre el diálogo
              startIcon={<Iconify icon="solar:shield-off-bold" />}
            >
              {t('Disable')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setShowAuthAppSetup(true)}
              startIcon={<Iconify icon="solar:shield-bold" />}
            >
              {t('Enable')}
            </Button>
          )}
        </Stack>

        {twoFactorStatus.enabled && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('Two-factor authentication is currently active using')}{' '}
            {get2FAMethodLabel(twoFactorStatus.method)}.
          </Alert>
        )}

        {/* Setup Options */}
        {!twoFactorStatus.enabled && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Authenticator App */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack>
                  <Typography variant="subtitle1">
                    {t('Authenticator App')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Use Google Authenticator or similar apps')}
                  </Typography>
                </Stack>
                <Button
                  variant="soft"
                  size="small"
                  onClick={() => setShowAuthAppSetup(!showAuthAppSetup)}
                  disabled={isEnabling2FA}
                >
                  {t('Setup')}
                </Button>
              </Stack>

              {showAuthAppSetup && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      {t('Click "Set up" to generate QR code and enable 2FA')}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleEnable2FA('app')}
                        disabled={isEnabling2FA}
                      >
                        {t('Set up')}
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        onClick={() => setShowAuthAppSetup(false)}
                      >
                        {t('Cancel')}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Paper>

            {/* Email Setup - CORREGIDO: Ahora muestra el email correctamente */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack>
                  <Typography variant="subtitle1">
                    {t('Email Verification')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Receive verification codes via email')}
                  </Typography>
                </Stack>
                <Button
                  variant="soft"
                  size="small"
                  onClick={() => setShowEmailSetup(!showEmailSetup)}
                  disabled={isEnabling2FA}
                >
                  {t('Setup')}
                </Button>
              </Stack>

              {showEmailSetup && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      {t('Verification codes will be sent to:')}{' '}
                      <strong>
                        {twoFactorStatus.email || t('No email configured')}
                      </strong>
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleEnable2FA('email')}
                        disabled={isEnabling2FA}
                      >
                        {t('Enable')}
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        onClick={() => setShowEmailSetup(false)}
                      >
                        {t('Cancel')}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        )}
      </Card>

      {/* Backup Email Section */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('Backup Email')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('Add a backup email address to recover your account')}
        </Typography>

        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label={t('Backup Email')}
              {...methods.register('backupEmail')}
              error={!!methods.formState.errors.backupEmail}
              helperText={methods.formState.errors.backupEmail?.message}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('Save Changes')}
            </Button>
          </Stack>
        </form>
      </Card>

      {/* Devices Section */}
      <Card sx={{ p: 3 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSignOutFromAllDevices}
          startIcon={<Iconify icon="solar:logout-2-bold" />}
          color="error"
        >
          {t('Sign out from all devices')}
        </Button>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ my: 3 }}
        >
          <Stack>
            <Typography variant="h6">{t('Devices')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Manage devices connected to your account')}
            </Typography>
          </Stack>
        </Stack>

        {devices.length > 0 ? (
          <Stack spacing={2}>
            {devices.map((device) => (
              <Paper key={device.id} variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify
                        icon={getDeviceIcon(device.deviceType)}
                        width={24}
                      />
                    </Box>
                    <Stack>
                      <Typography variant="subtitle2">{device.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {device.location} • {formatDate(device.lastActive)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveDevice(device.id)}
                    color="error"
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 3 }}
          >
            {t('No devices found')}
          </Typography>
        )}
      </Card>

      {/* Verification Dialog */}
      <Dialog
        open={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
      >
        <DialogTitle>
          {pendingMethod === 'app'
            ? t('Verify Authenticator App')
            : t('Verify Email Code')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {pendingMethod === 'app' && qrCode && (
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
              onChange={(code) => {
                setVerificationCode(code);
              }}
              onEnter={() => {
                // Solo ejecutar si el código tiene 6 dígitos
                if (verificationCode.length === 6) {
                  handleVerify2FA();
                }
              }}
            />

            {pendingMethod === 'email' && (
              <Button
                size="small"
                onClick={handleResendCode}
                sx={{ alignSelf: 'flex-start' }}
              >
                {t('Resend code')}
              </Button>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowVerificationDialog(false);
              setVerificationCode('');
              setPendingMethod(null);
            }}
          >
            {t('Cancel')}
          </Button>
          <Button onClick={handleVerify2FA} variant="contained">
            {t('Verify & Enable')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para deshabilitar 2FA */}
      <Dialog
        open={showDisable2FADialog}
        onClose={() => {
          setShowDisable2FADialog(false);
          setDisable2FACode('');
        }}
      >
        <DialogTitle>{t('Disable Two-Factor Authentication')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t(
                'Enter the 6-digit verification code from your authenticator app to disable 2FA.'
              )}
            </Typography>

            <OtpInput
              onChange={(code) => {
                setDisable2FACode(code);
              }}
              onEnter={() => {
                // Solo ejecutar si el código tiene 6 dígitos
                if (disable2FACode.length === 6) {
                  handleConfirmDisable2FA();
                }
              }}
            />

            {twoFactorStatus.method === 'email' && (
              <Button
                size="small"
                onClick={handleResendCode}
                sx={{ alignSelf: 'flex-start' }}
              >
                {t('Resend code')}
              </Button>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDisable2FADialog(false);
              setDisable2FACode('');
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleConfirmDisable2FA}
            variant="contained"
            color="error"
            disabled={isDisabling2FA || !disable2FACode}
          >
            {isDisabling2FA ? t('Verifying...') : t('Disable 2FA')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
