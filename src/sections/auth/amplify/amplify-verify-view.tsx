'use client';

import * as Yup from 'yup';
import { useCallback } from 'react';
import { paths } from '@/routes/paths';
import { useForm } from 'react-hook-form';
import Iconify from '@/components/iconify';
import { useAuthContext } from '@/auth/hooks';
import { EmailInboxIcon } from '@/assets/icons';
import { RouterLink } from '@/routes/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from '@/routes/hooks';
import { useCountdownSeconds } from '@/hooks/use-countdown';
import FormProvider, { RHFCode, RHFTextField } from '@/components/hook-form';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export default function AmplifyVerifyView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const { confirmRegister, resendCodeRegister } = useAuthContext();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchemaSchema = Yup.object().shape({
    code: Yup.string()
      .min(6, 'Code must be at least 6 characters')
      .required('Code is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
  });

  const defaultValues = {
    code: '',
    email: email || '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchemaSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await confirmRegister?.(data.email, data.code);
      router.push(paths.auth.amplify.login);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await resendCodeRegister?.(values.email);
    } catch (error) {
      console.error(error);
    }
  }, [resendCodeRegister, startCountdown, values.email]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <RHFCode name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          Resend code {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.amplify.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We have emailed a 6-digit confirmation code to acb@domain, please
          enter the code in below box to verify your email.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
