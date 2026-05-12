import React from 'react';
import { paths } from '@/routes/paths';
import { endpoints } from '@/utils/axios';
import Iconify from '@/components/iconify';
import { HOST_API } from '@/config-global';
import { RouterLink } from '@/routes/components';
import { useSnackbar } from '@/components/snackbar';
import { fToNowRefactor } from '@/utils/format-time';
import EmptyContent from '@/components/empty-content';
import { useTranslation } from '@/hooks/use-translation';
import { DeviceSuscriptions } from '@/types/service-worker';
import { useGetSubscriptionDevices } from '@/hooks/use-fetch';
import { useCreateGenericMutation } from '@/hooks/user-generic-mutation';

import {
  Box,
  Card,
  Paper,
  Stack,
  Button,
  IconButton,
  Typography,
  LinearProgress,
} from '@mui/material';

export default function AccountSubscriptionNotification() {
  const { t } = useTranslation();
  // Usar el custom hook para obtener datos de seguridad
  const { mutateAsync } = useCreateGenericMutation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: devicesData,
    isError,
    error: ErrorData,
    isFetching,
    refetch: refetchSecurity,
  } = useGetSubscriptionDevices();

  const devices: DeviceSuscriptions[] = (devicesData || []).filter(
    (d): d is DeviceSuscriptions => d !== undefined
  );

  const handleSignOutFromAllDevices = async () => {
    try {
      const response = await mutateAsync({
        pEndpoint: `${HOST_API}${endpoints.notification.deleteAllSubscriptions}`,
        method: 'POST',
        payload: {},
      });

      if (response.success) {
        await refetchSecurity();
        enqueueSnackbar(t('Signed out from all devices'), {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error signing out from devices'), {
        variant: 'error',
      });
    }
  };

  const handleRemoveDevice = async (device: DeviceSuscriptions) => {
    try {
      const response = await mutateAsync({
        pEndpoint: `${HOST_API}${endpoints.notification.unsubscribe}`,
        method: 'POST',
        payload: {
          endpoint: device.endpoint,
          deviceId: device.deviceInfo.deviceId,
        },
      });

      if (response.success) {
        await refetchSecurity();
        enqueueSnackbar(t('Device removed successfully'), {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error removing device'), { variant: 'error' });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return 'solar:smartphone-bold';
      case 'tablet':
        return 'solar:tablet-bold';
      default:
        return 'solar:laptop-bold';
    }
  };

  if (isFetching) {
    return <LinearProgress />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title={`${t(ErrorData?.message || 'Error loading security settings')}`}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            {t('Back to dashboard')}
          </Button>
        }
        sx={{ py: 10 }}
      />
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Button
        variant="contained"
        size="small"
        onClick={handleSignOutFromAllDevices}
        startIcon={<Iconify icon="solar:logout-2-bold" />}
        color="error"
      >
        {t('Sign out from all devices')}
      </Button>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ my: 3 }}
      >
        <Stack>
          <Typography variant="h6">{t('Devices')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Manage devices connected to your account')}
          </Typography>
        </Stack>
      </Stack>

      {devices.length > 0 ? (
        <Stack spacing={2}>
          {devices.map((device) => (
            <Paper key={device._id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify
                      icon={getDeviceIcon(device.deviceInfo.type)}
                      width={24}
                    />
                  </Box>
                  <Stack>
                    <Typography variant="subtitle2">
                      {device.deviceInfo.os}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {device.deviceInfo.browser} •{' '}
                      {fToNowRefactor(device.deviceInfo.lastActive)}
                    </Typography>
                    {/* isActive */}
                    {device.isActive ? (
                      <Typography variant="caption" color="success.main">
                        {t('Active now')}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="error.main">
                        {t('Inactive')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveDevice(device)}
                  color="error"
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 3 }}
        >
          {t('No devices found')}
        </Typography>
      )}
    </Card>
  );
}
