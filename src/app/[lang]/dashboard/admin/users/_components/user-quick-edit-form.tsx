import * as Yup from 'yup';
import { useMemo } from 'react';
import { IUser } from '@/src/types/api';
import { useForm } from 'react-hook-form';
import { endpoints } from '@/src/utils/axios';
import Iconify from '@/src/components/iconify';
import { HOST_API } from '@/src/config-global';
import { yupResolver } from '@hookform/resolvers/yup';
import { IPInfoResponse } from '@/src/hooks/use-ip-info';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';
import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '@/src/components/filters/filter-constants';
import {
  getPhoneHelperText,
  getPhonePlaceholder,
  simplePhoneValidation,
} from '@/src/utils/phone-validation';

import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import { InputAdornment } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUser;
  ipDataInfo: IPInfoResponse | null;
  refetch: () => void;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  role: string;
  status?: string;
};

export default function UserQuickEditForm({
  currentUser,
  open,
  onClose,
  ipDataInfo,
  refetch,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync } = useCreateGenericMutation();

  const userStatus = USER_STATUS_OPTIONS.find(
    (option) => option.value === currentUser?.userStatus.toString()
  ) as any;

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    phone: Yup.string()
      .required('Phone number is required')
      .test(
        'valid-phone',
        'Please enter a valid phone number for the selected country',
        simplePhoneValidation
      ),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues: FormValues = useMemo(
    () => ({
      name: currentUser?.profile.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.profile.phone || '',
      address: currentUser?.profile.address || '',
      country: currentUser?.profile.country || '',
      role: currentUser?.role.toString() || '',
      status: currentUser?.userStatus,
    }),
    [currentUser]
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Observar cambios en el país para revalidar el teléfono
  const watchCountry = watch('country');
  const watchPhone = watch('phone');

  // Revalidar el teléfono cuando cambia el país
  useMemo(() => {
    if (watchPhone && watchCountry) {
      methods.trigger('phone');
    }
  }, [watchCountry, watchPhone, methods]);

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

          // Formatear el número telefónico a formato internacional
          const formattedPhone = phoneNumber.formatInternational();
          console.log('Formatted phone:', formattedPhone);

          // Actualizar el dato con el teléfono formateado si lo deseas
          // data.phone = formattedPhone;
        }
      }

      const updateData = {
        ...data,
        id: currentUser?.id,
        userStatus: Number(data.status),
        role: Number(data.role),
      };
      await mutateAsync<IUser>({
        payload: updateData as unknown as IUser,
        pEndpoint: `${HOST_API}${endpoints.admin.users.updateUserById}`,
        method: 'PUT',
      });
      refetch();
      onClose();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating user', { variant: 'error' });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert
            variant="outlined"
            severity={userStatus?.color || 'info'}
            sx={{ mb: 3 }}
          >
            Account is {userStatus?.label} for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="role" label="Role">
              {USER_ROLE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="email" label="Email Address" />
            <RHFTextField name="name" label="Full Name" />

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
              placeholder={getPhonePlaceholder(watchCountry, 'Phone number')}
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
                        {`${countries
                          .find(
                            (c) =>
                              c.label.toLowerCase() ===
                              watchCountry?.toLowerCase()
                          )
                          ?.phone.toLowerCase()}`}{' '}
                        )
                      </Box>
                    </Stack>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField name="address" label="Address" />

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
