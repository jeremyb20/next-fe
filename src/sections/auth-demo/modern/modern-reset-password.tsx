'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { endpoints } from '@/src/utils/axios';
import { HOST_API } from '@/src/config-global';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';

import Link from '@mui/material/Link';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { SentIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

interface ModernResetPasswordViewProps {
  token: string;
}

export default function ModernResetPasswordView({
  token,
}: ModernResetPasswordViewProps) {
  const password = useBoolean();
  const { mutateAsync } = useCreateGenericMutation();
  const { t } = useTranslation();

  const [messageResponse, setMessageResponse] = useState({
    status: '',
    message: '',
  });

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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync({
        payload: {
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
          token,
        },
        pEndpoint: `${HOST_API}${endpoints.user.resetPassword}`,
        method: 'POST',
      });
      setMessageResponse({ status: 'success', message: res.message });
      console.info('DATA', data);
    } catch (error) {
      console.error(error);

      let errorMessage = '';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Something went wrong!';
      }

      // Si error tiene requirements array
      if (error.requirements && Array.isArray(error.requirements)) {
        // Convertir array a string
        const requirementsText = error.requirements.join('\n• ');
        errorMessage = `${errorMessage}\n\nRequisitos:\n• ${requirementsText}`;
      }

      setMessageResponse({
        status: 'error',
        message: errorMessage, // ✅ Ahora es un string
      });
    }
  });

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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('Reset Password')}
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
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
