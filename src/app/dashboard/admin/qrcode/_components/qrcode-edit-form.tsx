import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { IQrCode } from '@/src/types/api';
import { endpoints } from '@/src/utils/axios';
import { HOST_API } from '@/src/config-global';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, Dispatch, useEffect, SetStateAction } from 'react';
import { useCreateGenericMutation } from '@/src/hooks/user-generic-mutation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, MenuItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentQrCode?: IQrCode;
  close: Dispatch<SetStateAction<boolean>>;
  refetchAll: () => void;
};

// Define el tipo del formulario explícitamente
type FormValues = {
  status: 'available' | 'assigned' | 'activated' | 'expired' | 'pending';
  randomCode: string;
  assignedTo: string;
  assignedPet: string;
  activationDate: string;
  hostName: string;
};

const statusOptions = [
  'available',
  'assigned',
  'activated',
  'expired',
  'pending',
];

export default function QrCodeEditForm({
  currentQrCode,
  close,
  refetchAll,
}: Props) {
  const { mutateAsync } = useCreateGenericMutation();
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  // Define el schema con tipos explícitos
  const QrCodeSchema = Yup.object().shape({
    status: Yup.string()
      .oneOf(['available', 'assigned', 'activated', 'expired', 'pending'])
      .required('Status is required'),
    randomCode: Yup.string().required('Random code is required'),
    assignedTo: Yup.string().default(''),
    assignedPet: Yup.string().default(''),
    activationDate: Yup.string().default(''),
    hostName: Yup.string().default(''),
  });

  const defaultValues = useMemo(
    (): FormValues => ({
      status: currentQrCode?.status || 'available',
      randomCode: currentQrCode?.randomCode || '',
      assignedTo: currentQrCode?.assignedTo || '',
      assignedPet: currentQrCode?.assignedPet || '',
      activationDate: currentQrCode?.activationDate || '',
      hostName: currentQrCode?.hostName || '',
    }),
    [currentQrCode]
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(QrCodeSchema) as any,
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentQrCode) {
      reset(defaultValues);
    }
  }, [currentQrCode, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentQrCode) return;
      const updateData = {
        id: currentQrCode?._id,
        ...data,
      };

      await mutateAsync<IQrCode>({
        payload: updateData as any,
        pEndpoint: `${HOST_API}${endpoints.admin.qrcode.updateQRCode}`,
        method: 'PUT',
      });
      enqueueSnackbar('QR code updated successfully!', { variant: 'success' });
      refetchAll();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating QR code!', { variant: 'error' });
    }
  });

  const renderBasicInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Basic Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            QR code identification and status
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Basic Information" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="randomCode"
                label="Random Code"
                InputProps={{
                  readOnly: true,
                }}
              />

              <RHFSelect
                name="status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {statusOptions.map((size) => (
                  <MenuItem
                    key={size}
                    value={size}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {size}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="hostName" label="Host Name" />

              <RHFTextField
                name="activationDate"
                label="Activation Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: 'text.disabled', fontStyle: 'italic' }}
            >
              QR Code ID: {currentQrCode?._id}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAssignment = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Assignment
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            User and pet assignment information
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Assignment" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="assignedTo"
                label="Assigned To (User ID)"
                placeholder="Enter user ID"
              />

              <RHFTextField
                name="assignedPet"
                label="Assigned Pet (Pet ID)"
                placeholder="Enter pet ID"
              />
            </Box>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Purchase Information
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2">Price:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${currentQrCode?.purchaseInfo?.price || 0}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2">Seller:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {currentQrCode?.purchaseInfo?.seller || 'N/A'}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2">Sold Date:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {currentQrCode?.purchaseInfo?.soldDate || 'N/A'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderMetadata = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Metadata
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Creation and update information
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Metadata" />}

          <Stack spacing={2} sx={{ p: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.neutral',
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Created At:
                  </Typography>
                  <Typography variant="body2">
                    {currentQrCode?.createdAt
                      ? new Date(currentQrCode.createdAt).toLocaleString()
                      : 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Updated At:
                  </Typography>
                  <Typography variant="body2">
                    {currentQrCode?.updatedAt
                      ? new Date(currentQrCode.updatedAt).toLocaleString()
                      : 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Activated By:
                  </Typography>
                  <Typography variant="body2">
                    {currentQrCode?.activatedBy || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="outlined" size="large" onClick={() => close(false)}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          Save Changes
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderBasicInfo}

        {renderAssignment}

        {renderMetadata}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
