'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { paths } from '@/routes/paths';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { endpoints } from '@//utils/axios';
import Iconify from '@/components/iconify';
import { HOST_API } from '@//config-global';
import { PasswordIcon } from '@/assets/icons';
import { useTranslation } from 'react-i18next';
import { RouterLink } from '@/routes/components';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { useCreateGenericMutation } from '@//hooks/user-generic-mutation';

import Link from '@mui/material/Link';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export default function ModernForgotPasswordView() {
  const { mutateAsync } = useCreateGenericMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [messageResponse, setMessageResponse] = useState({
    status: '',
    message: '',
  });

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('Email is required'))
      .email(t('Email must be a valid email address')),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync({
        payload: data,
        pEndpoint: `${HOST_API}${endpoints.user.forgotPassword}`,
        method: 'POST',
      });
      setMessageResponse({ status: 'success', message: res.message });
      console.info('DATA', data);
      enqueueSnackbar(t('Request sent! Please check your email.'));
    } catch (error) {
      console.error(error);
      setMessageResponse({
        status: 'error',
        message: t(
          typeof error === 'string'
            ? error
            : error.message || 'Something went wrong!'
        ),
      });
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label={t('Email address')} />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        {t('Send Request')}
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.login}
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
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">{t('Forgot your password?')}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t(
            'Please enter the email address associated with your account and We will email you a link to reset your password.'
          )}
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}

      {!!messageResponse.message && (
        <Alert
          severity={messageResponse.status as 'error' | 'success'}
          sx={{ my: 3 }}
          onClose={() => setMessageResponse({ status: '', message: '' })}
        >
          {t(messageResponse.message)}
        </Alert>
      )}
    </FormProvider>
  );
}
