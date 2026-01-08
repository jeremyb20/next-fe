import * as Yup from 'yup';
import { useMemo } from 'react';
import { IUser } from '@/src/types/api';
import { useForm } from 'react-hook-form';
import { endpoints } from '@/src/utils/axios';
import Iconify from '@/src/components/iconify';
import { HOST_API } from '@/src/config-global';
import { yupResolver } from '@hookform/resolvers/yup';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
} from '@/src/utils/phone-validation';
import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { InputAdornment } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// import { fData } from 'src/utils/format-number';

import { useBoolean } from '@/src/hooks/use-boolean';
import StyledAvatar from '@/src/components/avatar/styled-avatar';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  // RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import AccountSelectionModal from './account-selection-modal';

// ----------------------------------------------------------------------

type UserType = {
  displayName: string;
  email: string;
  avatarProfile: string;
  phone: string;
  country: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  // about: string;
  isPublic: boolean;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateUserProfile } = useManagerUser();
  const { mutateAsync } = useCreateGenericMutation();
  const avatarDialog = useBoolean();

  const avatars = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        src: `/assets/images/avatars/avatar-${i + 1}.webp`,
        alt: `Avatar ${i + 1}`,
      })),
    []
  );

  // Validación simplificada del teléfono
  const phoneValidation = (phone: string, context: any) => {
    const { country } = context.parent;

    if (!country || !phone) {
      return true; // Deja que las validaciones required de Yup manejen esto
    }

    const countryData = countries.find((c) => c.label === country);
    if (!countryData) return false;

    const countryCode = countryData.code as CountryCode;
    return isValidPhoneNumber(phone, countryCode);
  };

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    avatarProfile: Yup.mixed<any>().nullable().required('Avatar is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .test(
        'valid-phone',
        'Please enter a valid phone number for the selected country',
        phoneValidation
      ),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    // about: Yup.string().required('About is required'),
    // not required
    isPublic: Yup.boolean(),
  });

  const defaultValues: UserType = useMemo(
    () => ({
      displayName: user?.displayName || '',
      email: user?.email || '',
      avatarProfile: user?.avatarProfile || null,
      phone: user?.phone || '',
      country: user?.country || '',
      address: user?.address || '',
      state: user?.state || '',
      city: user?.city || '',
      zipCode: user?.zipCode || '',
      // about: user?.about || '',
      isPublic: user?.isPublic || false,
    }),
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    trigger,
    formState: { isSubmitting },
  } = methods;

  // Observar cambios en el país y teléfono para revalidar
  const watchCountry = watch('country');
  const watchPhone = watch('phone');

  // Revalidar el teléfono cuando cambia el país
  useMemo(() => {
    if (watchPhone && watchCountry) {
      trigger('phone');
    }
  }, [watchCountry, watchPhone, trigger]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validar el teléfono una vez más antes de enviar
      if (data.country && data.phone) {
        const countryData = countries.find((c) => c.label === data.country);
        if (countryData) {
          const countryCode = countryData.code as CountryCode;
          const phoneNumber = parsePhoneNumberFromString(
            data.phone,
            countryCode
          );

          if (!phoneNumber || !isValidPhoneNumber(data.phone, countryCode)) {
            enqueueSnackbar('Please enter a valid phone number', {
              variant: 'error',
            });
            return;
          }

          // Opcional: Formatear el número telefónico a formato internacional
          // const formattedPhone = phoneNumber.formatInternational();
          // data.phoneNumber = formattedPhone;
        }
      }

      const updateProfile = {
        ...data,
        name: data.displayName,
        phone: data.phone,
        avatarProfile: data.avatarProfile,
      };

      // await new Promise((resolve) => setTimeout(resolve, 500));
      await mutateAsync<IUser>({
        payload: updateProfile as unknown as IUser,
        pEndpoint: `${HOST_API}${endpoints.user.updateMyProfile}`,
        method: 'PUT',
      });
      updateUserProfile(updateProfile);
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating profile', { variant: 'error' });
    }
  });

  // const handleDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const file = acceptedFiles[0];

  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });

  //     if (file) {
  //       setValue('photoURL', newFile, { shouldValidate: true });
  //     }
  //   },
  //   [setValue]
  // );

  const handleSelectAvatar = async (avatarSrc: string) => {
    setValue('avatarProfile', avatarSrc, { shouldValidate: true });
    try {
      await mutateAsync<IUser>({
        payload: { avatarProfile: avatarSrc } as unknown as IUser,
        pEndpoint: `${HOST_API}${endpoints.user.updateMyProfile}`,
        method: 'PUT',
      });
      updateUserProfile({ avatarProfile: avatarSrc });
      avatarDialog.onFalse();
      enqueueSnackbar('Avatar updated successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error updating avatar', { variant: 'error' });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card
              sx={{
                pt: 10,
                pb: 5,
                px: 3,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {/* <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            /> */}
              <StyledAvatar
                src={user?.photoURL}
                alt={user?.displayName}
                onClick={() => {
                  avatarDialog.onTrue();
                }}
                sx={{ width: 200, height: 200, mt: 2 }}
              />

              <RHFSwitch
                name="isPublic"
                labelPlacement="start"
                label="Public Profile"
                sx={{ mt: 5 }}
              />

              <Button variant="soft" color="error" sx={{ mt: 3 }}>
                Delete User
              </Button>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="displayName" label="Name" />
                <RHFTextField name="email" label="Email Address" />
                <RHFAutocomplete
                  name="country"
                  type="country"
                  label="Country"
                  placeholder="Choose a country"
                  fullWidth
                  options={countries.map((option) => option.label)}
                  getOptionLabel={(option) => option}
                />
                <RHFTextField
                  name="phone"
                  label="Phone Number"
                  placeholder={getPhonePlaceholder(
                    watchCountry,
                    'Phone number'
                  )}
                  helperText={getPhoneHelperText(watchCountry, watchPhone)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify
                            icon={`flag:${countries
                              .find(
                                (c) =>
                                  c.label.toLowerCase() ===
                                  watchCountry?.toLowerCase()
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

                <RHFTextField name="city" label="City" />
                <RHFTextField name="state" label="State/Region/Province" />
                {/* <RHFTextField name="address" label="Address" /> */}
                <RHFTextField name="zipCode" label="Zip/Code" />
              </Box>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <RHFTextField
                  name="address"
                  multiline
                  rows={4}
                  label="Address"
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <AccountSelectionModal
        avatarDialog={avatarDialog}
        user={user}
        avatars={avatars}
        handleSelectAvatar={handleSelectAvatar}
      />
    </>
  );
}
