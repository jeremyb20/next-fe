import * as Yup from 'yup';
import { IUser } from '@/src/types/api';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { endpoints } from '@/src/utils/axios';
import Iconify from '@/src/components/iconify';
import { HOST_API } from '@/src/config-global';
import { yupResolver } from '@hookform/resolvers/yup';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
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
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type UserType = {
  displayName: string;
  email: string;
  photoURL: any;
  phoneNumber: string;
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
    photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
    phoneNumber: Yup.string()
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
      photoURL: user?.photoURL || null,
      phoneNumber: user?.phoneNumber || '',
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
  const watchPhone = watch('phoneNumber');

  // Revalidar el teléfono cuando cambia el país
  useMemo(() => {
    if (watchPhone && watchCountry) {
      trigger('phoneNumber');
    }
  }, [watchCountry, watchPhone, trigger]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validar el teléfono una vez más antes de enviar
      if (data.country && data.phoneNumber) {
        const countryData = countries.find((c) => c.label === data.country);
        if (countryData) {
          const countryCode = countryData.code as CountryCode;
          const phoneNumber = parsePhoneNumberFromString(
            data.phoneNumber,
            countryCode
          );

          if (
            !phoneNumber ||
            !isValidPhoneNumber(data.phoneNumber, countryCode)
          ) {
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
        phone: data.phoneNumber,
        photoProfile: data.photoURL,
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

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // Función para obtener el placeholder del teléfono según el país
  const getPhonePlaceholder = () => {
    if (!watchCountry) return 'Phone number';

    const countryData = countries.find((c) => c.label === watchCountry);
    if (!countryData) return 'Phone number';

    const countryCode = countryData.code as CountryCode;

    // Ejemplos de formatos por país
    const examples: Record<string, string> = {
      US: '(555) 123-4567',
      MX: '55 1234 5678',
      ES: '612 345 678',
      FR: '6 12 34 56 78',
      GB: '07123 456789',
      BR: '(11) 91234-5678',
      AR: '11 2345-6789',
      CO: '301 1234567',
    };

    return examples[countryCode] || 'Phone number';
  };

  // Función para obtener el mensaje de ayuda
  const getPhoneHelperText = () => {
    if (!watchCountry) return 'Select a country first';

    const countryData = countries.find((c) => c.label === watchCountry);
    if (!countryData) return 'Invalid country';

    const countryCode = countryData.code as CountryCode;
    const phoneValue = watchPhone;

    if (!phoneValue) return `Enter phone number for ${watchCountry}`;

    try {
      const phoneNumber = parsePhoneNumberFromString(phoneValue, countryCode);
      if (phoneNumber && isValidPhoneNumber(phoneValue, countryCode)) {
        return `✓ Valid ${watchCountry} number`;
      }
    } catch (error) {
      // Ignorar errores de parsing
    }

    return `Enter valid phone number for ${watchCountry}`;
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
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
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFTextField
                name="phoneNumber"
                label="Phone Number"
                placeholder={getPhonePlaceholder()}
                helperText={getPhoneHelperText()}
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
                          width={20}
                        />
                        <Box component="span" sx={{ fontSize: '0.875rem' }}>
                          (+
                          {`${countries.find(
                            (c) =>
                              c.label.toLowerCase() ===
                              watchCountry?.toLowerCase()
                          )?.phone}`}
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
              <RHFTextField name="address" multiline rows={4} label="Address" />

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
  );
}
