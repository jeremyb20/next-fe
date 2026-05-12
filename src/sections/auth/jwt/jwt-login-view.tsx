'use client';

import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import { paths } from '@/routes/paths';
import Image from '@/components/image';
import { useForm } from 'react-hook-form';
import Iconify from '@/components/iconify';
import { useAuthContext } from '@/auth/hooks';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { useRef, useState, useEffect } from 'react';
import { useSnackbar } from '@/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeviceInfo } from '@/hooks/use-device-info';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter, useSearchParams } from '@/routes/hooks';
import OtpInput from '@/components/custom-inputs/otp-input';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { SITEKEY, APP_NAME, HOST_API, PATH_AFTER_LOGIN } from '@/config-global';

import { Box } from '@mui/system';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, Container, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

// Importar Turnstile dinámicamente para evitar errores de hidratación
const Turnstile = dynamic(
  () => import('@marsidev/react-turnstile').then((mod) => mod.Turnstile),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          minHeight: '65px',
        }}
      >
        <CircularProgress size={20} />
        <Typography variant="caption" color="text.secondary">
          Loading security verification...
        </Typography>
      </Box>
    ),
  }
);

export default function JwtLoginView() {
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuthContext();
  const { t } = useTranslation();

  const router = useRouter();
  const deviceInfo = useDeviceInfo();

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
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
    turnstileToken: string;
  } | null>(null);

  // Estados para cooldown del botón de reenvío
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('Email is required'))
      .email(t('Email must be a valid email address')),
    password: Yup.string().required(t('Password is required')),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const watchedPassword = watch('password');
  const watchedEmail = watch('email');

  // Limpiar timer al desmontar
  useEffect(
    () => () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
    },
    []
  );

  // Resetear error cuando el usuario escribe
  useEffect(() => {
    if (requiresTwoFactor) {
      // No mostrar error de Turnstile mientras se espera 2FA
    }
  }, [watchedEmail, watchedPassword, requiresTwoFactor]);

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
      setIsVerifying2FA(false);

      // Validar que el token de Turnstile existe
      if (!turnstileToken) {
        enqueueSnackbar(t('Please verify that you are not a robot'), {
          variant: 'warning',
        });
        return;
      }

      // ✅ Guardar el token para reutilizarlo si es necesario
      const savedTurnstileToken = turnstileToken;

      // Intentar login - SIN código 2FA primero
      const result = await login?.(
        data.email,
        data.password,
        savedTurnstileToken,
        undefined,
        deviceInfo
      );

      // ✅ ESCENARIO 1: Login exitoso (sin 2FA)
      if (result?.success) {
        // Login exitoso, resetear Turnstile para futuros intentos
        resetTurnstile();
        router.push(returnTo || PATH_AFTER_LOGIN);
        return;
      }

      // ✅ ESCENARIO 2: Se requiere 2FA
      if (result?.requiresTwoFactor) {
        // Guardamos las credenciales incluyendo el token de Turnstile
        setLoginCredentials({
          email: data.email,
          password: data.password,
          turnstileToken: savedTurnstileToken, // ✅ Guardamos el token
        });
        setRequiresTwoFactor(true);
        setTempToken(result.tempToken);
        setTwoFactorMethod(result.method);

        // Si es 2FA por email, iniciar cooldown para el botón de reenvío
        if (result.method === 'email') {
          setResendCooldown(30);
        }

        return;
      }

      // Caso 3: Error de credenciales
      enqueueSnackbar(t(result?.message || 'Invalid credentials'), {
        variant: 'warning',
      });
      setValue('password', '');
      resetTurnstile();
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(t(error?.message || 'An error occurred during login'), {
        variant: 'warning',
      });
      setValue('password', '');
      resetTurnstile();
    }
  });

  const handleVerify2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      enqueueSnackbar(t('Please enter a valid 6-digit verification code'), {
        variant: 'warning',
      });
      return;
    }

    if (!loginCredentials) {
      enqueueSnackbar(t('Session expired. Please try again'), {
        variant: 'warning',
      });
      setRequiresTwoFactor(false);
      resetTurnstile();
      return;
    }

    try {
      setIsVerifying2FA(true);

      // ✅ Usar el MISMO token que guardamos del primer intento
      const result = await login?.(
        loginCredentials.email,
        loginCredentials.password,
        loginCredentials.turnstileToken, // ✅ Reutilizamos el token
        twoFactorCode,
        deviceInfo
      );

      if (result?.success) {
        // Login exitoso, resetear Turnstile para futuros intentos
        resetTurnstile();
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else {
        enqueueSnackbar(t(result?.message || 'Invalid verification code'), {
          variant: 'warning',
        });
        setTwoFactorCode('');
        // No resetear Turnstile aquí, el usuario puede reintentar con el mismo token
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(t(error.message || 'Error verifying code'), {
        variant: 'warning',
      });
      setTwoFactorCode('');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleResend2FACode = async () => {
    // Verificar cooldown
    if (resendCooldown > 0) {
      enqueueSnackbar(
        t(
          `Please wait ${resendCooldown} seconds before requesting another code`
        ),
        {
          variant: 'warning',
        }
      );
      return;
    }

    if (!tempToken) {
      enqueueSnackbar(t('Session expired. Please try again'), {
        variant: 'warning',
      });
      setRequiresTwoFactor(false);
      resetTurnstile();
      return;
    }

    try {
      setIsResending(true);

      const response = await fetch(`${HOST_API}/api/user/resend2FACode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Iniciar cooldown de 30 segundos
        setResendCooldown(30);

        // Mostrar mensaje de éxito
        enqueueSnackbar(t('New verification code sent to your email'), {
          variant: 'success',
        });

        // Limpiar el código anterior para que el usuario ingrese el nuevo
        setTwoFactorCode('');

        // Resetear los campos del OTP
        const otpInputs = document.querySelectorAll('input[type="tel"]');
        otpInputs.forEach((input) => {
          (input as HTMLInputElement).value = '';
        });
      } else {
        enqueueSnackbar(t(result.message || 'Error sending code'), {
          variant: 'error',
        });
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(t('Error sending verification code'), {
        variant: 'error',
      });
    } finally {
      setIsResending(false);
    }
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

  // Formatear tiempo de cooldown
  const formatCooldownTime = (seconds: number): string => {
    if (seconds <= 0) return '';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Stack>
        <Image
          src="/assets/images/home/pets.png"
          alt={t('Lets Get Started')}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 1.5,
          }}
        />
      </Stack>
      <Typography variant="h4">
        {t('Sign in to')} {APP_NAME}
      </Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('New user?')}</Typography>

        <Link
          component={RouterLink}
          href={paths.auth.signUp}
          variant="subtitle2"
        >
          {t('Create an account')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label={t('Email address')} />

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

      <Link
        component={RouterLink}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
        href={paths.auth.forgotPassword}
      >
        {t('Forgot password?')}
      </Link>

      {/* Widget de Cloudflare Turnstile */}
      {SITEKEY && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <Turnstile
            ref={turnstileRef}
            siteKey={SITEKEY}
            onSuccess={(token) => {
              console.log('✅ Turnstile verification successful');
              setTurnstileToken(token);
            }}
            onExpire={() => {
              console.log('⏰ Turnstile token expired');
              setTurnstileToken(null);
              // Si estaba en proceso de 2FA, mostrar mensaje
              if (requiresTwoFactor) {
                enqueueSnackbar(
                  t('Security verification expired. Please try again.'),
                  { variant: 'warning' }
                );
              }
            }}
            onError={() => {
              console.error('❌ Turnstile error');
              enqueueSnackbar(
                t('Security verification failed. Please refresh the page.'),
                { variant: 'error' }
              );
              setTurnstileToken(null);
            }}
            options={{
              theme: 'light',
              size: 'normal',
              action: 'login_submit',
              retry: 'auto',
            }}
          />
        </Box>
      )}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!turnstileToken || !watchedPassword}
      >
        {t('Sign In')}
      </LoadingButton>
    </Stack>
  );

  // Diálogo para ingresar código 2FA
  const render2FADialog = (
    <Dialog
      open={requiresTwoFactor}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          setRequiresTwoFactor(false);
          setTwoFactorCode('');
          setTempToken('');
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
              ? t('Please enter the 6-digit code from your authenticator app')
              : t('Please enter the verification code sent to your email')}
          </Alert>

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
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Button
                size="small"
                onClick={handleResend2FACode}
                disabled={isResending || resendCooldown > 0}
                sx={{ alignSelf: 'flex-start' }}
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
            setLoginCredentials(null);
            setValue('password', '');
            setResendCooldown(0);
            if (resendTimerRef.current) {
              clearInterval(resendTimerRef.current);
            }
          }}
          disabled={isVerifying2FA}
        >
          {t('Cancel')}
        </Button>
        <LoadingButton
          onClick={handleVerify2FA}
          variant="contained"
          loading={isVerifying2FA}
          disabled={!twoFactorCode || twoFactorCode.length !== 6}
        >
          {t('Verify & Sign In')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xs">
      <Box py={10}>
        {renderHead}

        <Alert severity="info" sx={{ mb: 3 }}>
          {t('Use your credentials to login.')}
        </Alert>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>

        {render2FADialog}
      </Box>
    </Container>
  );
}
