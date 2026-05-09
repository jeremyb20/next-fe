'use client';

import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import { paths } from '@/routes/paths';
import { useForm } from 'react-hook-form';
import { SentIcon } from '@/assets/icons';
import { endpoints } from '@/utils/axios';
import Iconify from '@/components/iconify';
import { useParams } from '@/routes/hooks';
import { HOST_API } from '@/config-global';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { fallbackLng } from '@/app/i18n/settings';
import { useRef, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from '@/hooks/use-translation';
import OtpInput from '@/components/custom-inputs/otp-input';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Alert, Button, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

// Importar Turnstile dinámicamente
const Turnstile = dynamic(
  () => import('@marsidev/react-turnstile').then((mod) => mod.Turnstile),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress size={24} />
      </Box>
    ),
  }
);

interface ModernResetPasswordViewProps {
  token: string;
}

export default function ModernResetPasswordView({
  token,
}: ModernResetPasswordViewProps) {
  const password = useBoolean();
  const { mutateAsync } = useCreateGenericMutation();
  const { t } = useTranslation();
  const params = useParams();
  const lng = (params?.lang as string) || fallbackLng;
  const [messageResponse, setMessageResponse] = useState({
    status: '',
    message: '',
  });

  // Estados para Turnstile
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<any>(null);

  // Estados para 2FA
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState<
    'app' | 'email' | null
  >(null);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [resetCredentials, setResetCredentials] = useState<{
    newPassword: string;
    confirmPassword: string;
  } | null>(null);

  // Estados para cooldown del botón de reenvío
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t('Password must be at least 6 characters'))
      .required(t('Password is required'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t(
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        )
      ),
    confirmPassword: Yup.string()
      .required(t('Confirm password is required'))
      .oneOf([Yup.ref('password')], t('Passwords must match')),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Limpiar timer al desmontar
  useEffect(
    () => () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
    },
    []
  );

  // Efecto para manejar el cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      resendTimerRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (resendTimerRef.current) {
              clearInterval(resendTimerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
    };
  }, [resendCooldown]);

  // Función para resetear Turnstile
  const resetTurnstile = () => {
    if (turnstileRef.current) {
      turnstileRef.current.reset();
      setTurnstileToken(null);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setMessageResponse({ status: '', message: '' });
      setIsVerifying2FA(false);

      // Validar que el token de Turnstile existe
      if (!turnstileToken) {
        setMessageResponse({
          status: 'error',
          message: t('Please verify that you are not a robot'),
        });
        return;
      }

      // Guardar el token y credenciales
      const savedTurnstileToken = turnstileToken;

      // Intentar reset - SIN código 2FA primero
      const result = await mutateAsync({
        payload: {
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
          token,
          lang: lng,
          turnstileToken: savedTurnstileToken,
        },
        pEndpoint: `${HOST_API}${endpoints.user.resetPassword}`,
        method: 'POST',
      });

      // ✅ ESCENARIO 1: Reset exitoso (sin 2FA)
      if (result?.success) {
        resetTurnstile();
        setMessageResponse({ status: 'success', message: result.message });
        // Limpiar el formulario después de éxito
        setValue('password', '');
        setValue('confirmPassword', '');
        return;
      }

      // ✅ ESCENARIO 2: Se requiere 2FA
      if (result?.payload.requiresTwoFactor) {
        setResetCredentials({
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        });
        setRequiresTwoFactor(true);
        setTempToken(result.payload.tempToken);
        setTwoFactorMethod(result.payload.method);

        // Si es 2FA por email, iniciar cooldown
        if (result.payload.method === 'email') {
          setResendCooldown(30);
        }
        return;
      }

      // Caso 3: Error
      setMessageResponse({
        status: 'error',
        message: result?.message || t('Something went wrong'),
      });
      resetTurnstile();
    } catch (error: any) {
      console.error(error);

      let errorMessage = '';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = t('Something went wrong!');
      }

      if (error.requirements && Array.isArray(error.requirements)) {
        const requirementsText = error.requirements.join('\n• ');
        errorMessage = `${errorMessage}\n\nRequisitos:\n• ${requirementsText}`;
      }

      setMessageResponse({
        status: 'error',
        message: errorMessage,
      });
      resetTurnstile();
    }
  });

  const handleVerify2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setMessageResponse({
        status: 'error',
        message: t('Please enter a valid 6-digit verification code'),
      });
      return;
    }

    if (!resetCredentials) {
      setMessageResponse({
        status: 'error',
        message: t('Session expired. Please try again'),
      });
      setRequiresTwoFactor(false);
      resetTurnstile();
      return;
    }

    if (!turnstileToken) {
      setMessageResponse({
        status: 'error',
        message: t('Please verify that you are not a robot'),
      });
      return;
    }

    try {
      setIsVerifying2FA(true);
      setMessageResponse({ status: '', message: '' });

      const savedTurnstileToken = turnstileToken;

      const result = await mutateAsync({
        payload: {
          newPassword: resetCredentials.newPassword,
          confirmPassword: resetCredentials.confirmPassword,
          token,
          lang: lng,
          turnstileToken: savedTurnstileToken,
          twoFactorCode,
        },
        pEndpoint: `${HOST_API}${endpoints.user.resetPassword}`,
        method: 'POST',
      });

      if (result?.success) {
        resetTurnstile();
        setRequiresTwoFactor(false);
        setTwoFactorCode('');
        setTempToken('');
        setResetCredentials(null);
        setMessageResponse({ status: 'success', message: result.message });
        setValue('password', '');
        setValue('confirmPassword', '');
      } else {
        setMessageResponse({
          status: 'error',
          message: result?.message || t('Invalid verification code'),
        });
        setTwoFactorCode('');
      }
    } catch (error: any) {
      console.error(error);
      setMessageResponse({
        status: 'error',
        message: error.message || t('Error verifying code'),
      });
      setTwoFactorCode('');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleResend2FACode = async () => {
    if (resendCooldown > 0) {
      setMessageResponse({
        status: 'warning',
        message: t(
          `Please wait ${resendCooldown} seconds before requesting another code`
        ),
      });
      return;
    }

    if (!tempToken) {
      setMessageResponse({
        status: 'error',
        message: t('Session expired. Please try again'),
      });
      setRequiresTwoFactor(false);
      resetTurnstile();
      return;
    }

    try {
      setIsResending(true);

      const response = await fetch(
        `${HOST_API}/api/user/resend2FACodeForReset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tempToken }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setResendCooldown(30);
        setMessageResponse({
          status: 'success',
          message: t('New verification code sent to your email'),
        });
        setTwoFactorCode('');
        // Resetear campos OTP
        const otpInputs = document.querySelectorAll('input[type="tel"]');
        otpInputs.forEach((input) => {
          (input as HTMLInputElement).value = '';
        });
      } else {
        setMessageResponse({
          status: 'error',
          message: t(result.message || 'Error sending code'),
        });
      }
    } catch (error: any) {
      console.error(error);
      setMessageResponse({
        status: 'error',
        message: t('Error sending verification code'),
      });
    } finally {
      setIsResending(false);
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
    if (isResending) return <CircularProgress size={16} />;
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

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="password"
        label={t('Password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="confirmPassword"
        label={t('Confirm New Password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Widget de Cloudflare Turnstile */}
      <Box
        sx={{ display: 'flex', justifyContent: 'center', my: 1, width: '100%' }}
      >
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          onSuccess={(pToken) => {
            console.log('✅ Turnstile verification successful');
            setTurnstileToken(pToken);
          }}
          onExpire={() => {
            console.log('⏰ Turnstile token expired');
            setTurnstileToken(null);
            if (requiresTwoFactor) {
              setMessageResponse({
                status: 'warning',
                message: t('Security verification expired. Please try again.'),
              });
            }
          }}
          onError={() => {
            console.error('❌ Turnstile error');
            setTurnstileToken(null);
            setMessageResponse({
              status: 'error',
              message: t(
                'Security verification failed. Please refresh the page.'
              ),
            });
          }}
          options={{
            theme: 'light',
            size: 'normal',
            action: 'reset_password',
            retry: 'auto',
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!turnstileToken}
      >
        {t('Reset Password')}
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        {t('Return to sign in')}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">{t('Reset your password!')}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('Please enter your new password below.')}
        </Typography>
      </Stack>
    </>
  );

  // Diálogo para ingresar código 2FA
  const render2FADialog = (
    <Dialog
      open={requiresTwoFactor}
      onClose={(event, reason) => {
        // ✅ Solo permitir cerrar si la razón no es 'backdropClick' o 'escapeKeyDown'
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          setRequiresTwoFactor(false);
          setTwoFactorCode('');
          setTempToken('');
          setResetCredentials(null);
          setResendCooldown(0);
          if (resendTimerRef.current) {
            clearInterval(resendTimerRef.current);
          }
        }
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:shield-keyhole-bold" width={28} />
          <Typography variant="h6">
            {t('Two-Factor Authentication Required')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="info">
            {twoFactorMethod === 'app'
              ? t(
                  'Please enter the 6-digit code from your authenticator app to reset your password'
                )
              : t(
                  'Please enter the verification code sent to your email to reset your password'
                )}
          </Alert>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t('Enter verification code')}
          </Typography>

          <OtpInput
            onChange={(code) => {
              setTwoFactorCode(code);
            }}
            onEnter={() => {
              if (twoFactorCode.length === 6) {
                handleVerify2FA();
              }
            }}
          />

          {twoFactorMethod === 'email' && (
            <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={handleResend2FACode}
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
        <Button
          onClick={() => {
            setRequiresTwoFactor(false);
            setTwoFactorCode('');
            setTempToken('');
            setResetCredentials(null);
            setResendCooldown(0);
            if (resendTimerRef.current) {
              clearInterval(resendTimerRef.current);
            }
          }}
        >
          {t('Cancel')}
        </Button>
        <LoadingButton
          onClick={handleVerify2FA}
          variant="contained"
          loading={isVerifying2FA}
          disabled={!twoFactorCode || twoFactorCode.length !== 6}
        >
          {t('Verify & Reset Password')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}
        {renderForm}
      </FormProvider>

      {render2FADialog}

      {!!messageResponse.message && (
        <Alert
          severity={messageResponse.status as 'error' | 'success' | 'warning'}
          sx={{ my: 3 }}
          onClose={() => setMessageResponse({ status: '', message: '' })}
        >
          {t(messageResponse.message)}
        </Alert>
      )}
    </>
  );
}
