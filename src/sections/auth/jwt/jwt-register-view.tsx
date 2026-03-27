'use client';

import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import { paths } from '@/routes/paths';
import Image from '@/components/image';
import { useForm } from 'react-hook-form';
import { countries } from '@/assets/data';
import Iconify from '@/components/iconify';
import useIPInfo from '@/hooks/use-ip-info';
import { useAuthContext } from '@/auth/hooks';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { useRef, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import { useRouter, useSearchParams } from '@/routes/hooks';
import { SITEKEY, PATH_AFTER_LOGIN } from '@/config-global';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from '@/components/hook-form';
import PrivacyPolicyModal from '@/app/[lang]/privacy-policy/_components/privacy-policy-modal';
import TermsAndConditionsModal from '@/app/[lang]/terms-and-conditions/_components/terms-and-condition-modal';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/utils/phone-validation';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Container, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------
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
export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const { t } = useTranslation();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const password = useBoolean();
  const { ipData } = useIPInfo();
  const settings = useSettingsContext();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<any>(null);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required(t('First name is required')),
    lastName: Yup.string().required(t('Last name is required')),
    phone: Yup.string()
      .required(t('Phone number is required'))
      .test(
        'valid-phone',
        t('Please enter a valid phone number for the selected country'),
        simplePhoneValidation
      ),
    country: Yup.string().required(t('Country is required')),
    email: Yup.string()
      .required(t('Email is required'))
      .email(t('Email must be a valid email address')),
    password: Yup.string().required(t('Password is required')),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const watchCountry = watch('country');
  const watchPhone = watch('phone');
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);

  const handleClosePrivacyPolicy = () => {
    setOpenPrivacyPolicy(false);
  };

  const handleAcceptPrivacyPolicy = () => {
    setOpenPrivacyPolicy(false);
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  const handleAcceptTerms = () => {
    setOpenTerms(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');

      // Validar que el token de Turnstile existe
      if (!turnstileToken) {
        setErrorMsg(t('Please verify that you are not a robot'));
        return;
      }

      // Enviar el token junto con los datos de registro
      await register?.(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.country,
        data.phone,
        settings,
        turnstileToken // Enviar token de Turnstile
      );

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
      // Resetear Turnstile en caso de error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken(null);
    }
  });

  useEffect(() => {
    if (ipData?.country) {
      setValue('country', ipData.country, { shouldValidate: true });
    }
  }, [ipData, setValue]);

  const renderHead = (
    <Stack
      spacing={1}
      sx={{ mb: 2, position: 'relative', textAlign: 'center' }}
    >
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
      <Typography variant="h2">{t('Lets Get Started')}</Typography>

      <Typography variant="body1">
        {t('Create an account and manage your pets profile')}{' '}
      </Typography>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {t('By registering, I agree to the')}{' '}
      <Link underline="always" color="text.primary" onClick={handleOpenTerms}>
        {t('Terms and Conditions')}
      </Link>
      {'  '}
      {t('and')}{' '}
      <Link
        underline="always"
        color="text.primary"
        onClick={() => setOpenPrivacyPolicy(true)}
      >
        {t('Privacy Policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label={t('First name')} />
        <RHFTextField name="lastName" label={t('Last name')} />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: '1fr',
          mt: 1,
        }}
      >
        <RHFAutocomplete
          name="country"
          type="country"
          label={t('Country')}
          placeholder={t('Choose a country')}
          fullWidth
          options={countries.map((option) => option.label)}
          getOptionLabel={(option) => option}
        />
        <RHFTextField
          name="phone"
          label={t('Phone number')}
          placeholder={getPhonePlaceholder(watchCountry, t('Phone number'))}
          helperText={getPhoneHelperText(watchCountry, watchPhone, t)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify
                    icon={`flag:${countries
                      .find(
                        (c) =>
                          c.label.toLowerCase() === watchCountry?.toLowerCase()
                      )
                      ?.code.toLowerCase()}-4x3`}
                  />
                  <Box>
                    (+
                    {`${
                      countries
                        .find(
                          (c) =>
                            c.label.toLowerCase() ===
                            watchCountry?.toLowerCase()
                        )
                        ?.phone.toLowerCase() || ''
                    }`}{' '}
                    )
                  </Box>
                </Stack>
              </InputAdornment>
            ),
          }}
        />
      </Box>

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
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        {t('Create Account')}
      </LoadingButton>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ textAlign: 'center', justifyContent: 'center' }}
      >
        <Typography variant="body2">
          {' '}
          {t('Already have an account?')}{' '}
        </Typography>

        <Link
          href={paths.auth.signIn}
          component={RouterLink}
          variant="subtitle2"
        >
          {t('Sign in')}
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <Container maxWidth="xs">
      <Box sx={{ py: 4 }}>
        {renderHead}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>

        {renderTerms}
      </Box>
      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }} onClose={() => setErrorMsg('')}>
          {t(errorMsg)}
        </Alert>
      )}

      <TermsAndConditionsModal
        open={openTerms}
        onClose={handleCloseTerms}
        onAccept={handleAcceptTerms}
      />

      <PrivacyPolicyModal
        open={openPrivacyPolicy}
        onClose={handleClosePrivacyPolicy}
        onAccept={handleAcceptPrivacyPolicy}
      />
    </Container>
  );
}
