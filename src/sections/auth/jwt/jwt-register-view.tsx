'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIPInfo from '@/src/hooks/use-ip-info';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettingsContext } from '@/src/components/settings';
import PrivacyPolicyModal from '@/src/app/privacy-policy/_components/privacy-policy-modal';
import TermsAndConditionsModal from '@/src/app/terms-and-conditions/_components/terms-and-condition-modal';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/src/utils/phone-validation';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { countries } from 'src/assets/data';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

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
      await register?.(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.country,
        data.phone,
        settings
      );

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  useEffect(() => {
    if (ipData?.country) {
      setValue('country', ipData.country, { shouldValidate: true });
    }
  }, [ipData, setValue]);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('Get started absolutely free.')}</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          {' '}
          {t('Already have an account?')}{' '}
        </Typography>

        <Link
          href={paths.auth.login}
          component={RouterLink}
          variant="subtitle2"
        >
          {t('Sign in')}
        </Link>
      </Stack>
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
          helperText={getPhoneHelperText(watchCountry, watchPhone)}
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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        {t('Create Account')}
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}

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
    </>
  );
}
