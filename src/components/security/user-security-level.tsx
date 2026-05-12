import React from 'react';
import { SecurityLevel } from '@/types/security';
import { useTranslation } from '@/hooks/use-translation';
import { useManagerUser } from '@/hooks/use-manager-user';
import { getSecurityColor, getSecurityLevelText } from '@/utils/constants';

import {
  Box,
  Card,
  Alert,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';

import Iconify from '../iconify';

export default function UserSecurityLevel() {
  const { t } = useTranslation();
  const { user } = useManagerUser();
  const { security } = user;
  // ✅ Calcular nivel de seguridad
  const securityLevel: SecurityLevel = {
    level: 0,
    items: {
      emailVerified: security.isEmailVerified,
      twoFactorEnabled: security.twoFactorEnabled,
      backupEmailSet: !!security?.backupEmail,
    },
  };

  // Contar medidas activadas
  const activeSecurityItems = Object.values(securityLevel.items).filter(
    Boolean
  ).length;
  const securityPercentage = (activeSecurityItems / 3) * 100;

  return (
    <Card
      sx={{
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        background: `linear-gradient(135deg, ${getSecurityColor(
          securityPercentage
        )}10 0%, transparent 100%)`,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon="solar:shield-keyhole-bold"
              width={32}
              sx={{ color: getSecurityColor(securityPercentage) }}
            />
            <Typography variant="h6">{t('Security Level')}</Typography>
          </Stack>
          <Typography
            variant="subtitle1"
            sx={{
              color: getSecurityColor(securityPercentage),
              fontWeight: 'bold',
            }}
          >
            {getSecurityLevelText(securityPercentage, t)}
          </Typography>
        </Stack>

        {/* Progress Bar */}
        <Box sx={{ position: 'relative', mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={securityPercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                backgroundColor: getSecurityColor(securityPercentage),
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              right: 0,
              top: -20,
              color: getSecurityColor(securityPercentage),
              fontWeight: 'bold',
            }}
          >
            {activeSecurityItems}/3
          </Typography>
        </Box>

        {/* Security Recommendation */}
        {securityPercentage < 100 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {t('Complete all security measures to achieve maximum protection')}
          </Alert>
        )}
      </Stack>
    </Card>
  );
}
