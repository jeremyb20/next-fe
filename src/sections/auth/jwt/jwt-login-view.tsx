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
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter, useSearchParams } from '@/routes/hooks';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { SITEKEY, APP_NAME, PATH_AFTER_LOGIN } from '@/config-global';

import { Box } from '@mui/system';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Container, CircularProgress } from '@mui/material';

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
  const { login } = useAuthContext();
  const { t } = useTranslation();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<any>(null);

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
    formState: { isSubmitting },
  } = methods;

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');

      // Validar que el token de Turnstile existe
      if (!turnstileToken) {
        setErrorMsg(t('Please verify that you are not a robot'));
        return;
      }

      // Enviar el token junto con las credenciales
      await login?.(data.email, data.password, turnstileToken);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(t(typeof error === 'string' ? error : error.message));

      // Resetear Turnstile en caso de error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken(null);
    }
  });

  useEffect(() => {
    setErrorMsg('');
  }, [watchedEmail, watchedPassword]);

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
            }}
            onError={() => {
              console.error('❌ Turnstile error');
              setErrorMsg(
                t('Security verification failed. Please refresh the page.')
              );
              setTurnstileToken(null);
            }}
            options={{
              theme: 'light',
              size: 'normal',
              action: 'login_submit',
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
        disabled={!turnstileToken} // Deshabilitar hasta que se complete el captcha
      >
        {t('Sign In')}
      </LoadingButton>
    </Stack>
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

        {!!errorMsg && (
          <Alert severity="error" sx={{ my: 3 }}>
            {t(errorMsg)}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
