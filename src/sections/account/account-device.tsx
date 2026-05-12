import React from 'react';
import { Device } from '@/types/security';
import Iconify from '@/components/iconify';
import { fToNowRefactor } from '@/utils/format-time';
import { useTranslation } from '@/hooks/use-translation';

import {
  Box,
  Card,
  Paper,
  Stack,
  Button,
  IconButton,
  Typography,
} from '@mui/material';

interface Props {
  handleSignOutFromAllDevices: () => void;
  handleRemoveDevice: (id: string) => void;
  devices: Device[];
}
export default function AccountDevice({
  handleSignOutFromAllDevices,
  devices,
  handleRemoveDevice,
}: Props) {
  const { t } = useTranslation();

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
            <Paper key={device.id} variant="outlined" sx={{ p: 2 }}>
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
                      icon={getDeviceIcon(device.deviceType)}
                      width={24}
                    />
                  </Box>
                  <Stack>
                    <Typography variant="subtitle2">{device.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t(device.location)} • {fToNowRefactor(device.lastActive)}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveDevice(device.id)}
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
