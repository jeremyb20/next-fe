'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { yupResolver } from '@hookform/resolvers/yup';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import Iconify from '@/components/iconify';
import { useAuthContext } from '@/auth/hooks';
import { useBoolean } from '@/hooks/use-boolean';
import { NewPasswordIcon } from '@/assets/icons';
import FormProvider, { RHFTextField } from '@/components/hook-form';

// ----------------------------------------------------------------------

export default function SupabaseNewPasswordView() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const { updatePassword } = useAuthContext();

  const password = useBoolean();

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
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
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePassword?.(data.password);

      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Error saving user information'
      );
    }
  });

  const renderHead = (
    <>
      <NewPasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">New Password</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Successful updates enable access using the new password
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <RHFTextField
        name="password"
        label="Confirm Password"
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
        label="Password"
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

      <Button
        fullWidth
        type="submit"
        size="large"
        variant="contained"
        loading={isSubmitting}
      >
        Update Password
      </Button>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ textAlign: 'left', mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
