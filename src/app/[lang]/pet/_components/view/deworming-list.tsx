// components/medical-records/deworming-list.tsx
import React from 'react';
import Iconify from '@/components/iconify';
import { formatDate } from '@/utils/format-time';
import { useTranslation } from '@/hooks/use-translation';
import { IDewormingFormData } from '@/interfaces/medical-record';
import {
  isOverdue,
  isUpcoming,
  getDateColor,
  getDaysLabel,
  getDaysUntil,
  getProgressBarColor,
} from '@/utils/constants';

import {
  Box,
  Card,
  Chip,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

interface DewormingListProps {
  data: IDewormingFormData[];
  onEdit: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: IDewormingFormData
  ) => void;
  refetchTrigger?: number;
  isLoading?: boolean;
}

export default function DewormingList({
  data,
  onEdit,
  refetchTrigger,
  isLoading,
}: DewormingListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <CircularProgress />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              {t('Loading deworming treatments...')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Verificar si la notificación está activa y próxima a enviarse
  const getNotificationStatus = (deworming: IDewormingFormData) => {
    if (!deworming.emailNotificationEnabled) {
      return {
        active: false,
        message: 'Notifications turned off',
        icon: 'mdi:bell-off-outline',
        color: 'default',
      };
    }

    const daysUntil = getDaysUntil(deworming.nextDewormingDate);
    const notificationDays = deworming.notificationDaysBefore || 7;

    if (daysUntil <= notificationDays && daysUntil >= 0) {
      return {
        active: true,
        message: t(
          `We'll notify you in {{daysUntil}} days (set to {{notificationDays}} days in advance)`,
          {
            daysUntil,
            notificationDays,
          }
        ),
        icon: 'mdi:bell-ring-outline',
        color: 'warning',
      };
    }

    if (daysUntil < 0) {
      return {
        active: false,
        message: 'Overdue - notifications are paused',
        icon: 'mdi:bell-off-outline',
        color: 'error',
      };
    }

    return {
      active: true,
      message: t(
        'Active notifications - Well notify you {{notificationDays}} days in advance',
        {
          notificationDays,
        }
      ),
      icon: 'mdi:bell-outline',
      color: 'info',
    };
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <Iconify
              icon="fluent:pill-16-regular"
              width={48}
              sx={{ opacity: 0.5, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              {t('No deworming treatments have been recorded')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('Start by scheduling your pets first deworming')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((deworming, index) => {
        const notificationStatus = getNotificationStatus(deworming);
        const daysUntil = getDaysUntil(deworming.nextDewormingDate);
        const notificationDays = deworming.notificationDaysBefore || 7;

        return (
          <Card
            key={deworming._id || index}
            sx={{
              position: 'relative',
              backgroundColor: 'background.neutral',
              borderLeft: notificationStatus.active
                ? `4px solid ${
                    notificationStatus.color === 'warning'
                      ? '#ed6c02'
                      : '#0288d1'
                  }`
                : 'none',
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}
                  >
                    <Typography variant="h6" component="div">
                      {deworming.dewormerName}
                    </Typography>

                    {isUpcoming(deworming.nextDewormingDate) && (
                      <Chip
                        label={t('NEXT')}
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    {isOverdue(deworming.nextDewormingDate) && (
                      <Chip
                        label={t('EXPIRED')}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    {/* Badge de notificaciones */}
                    <Tooltip title={t(notificationStatus.message)}>
                      <Chip
                        icon={
                          <Iconify icon={notificationStatus.icon} width={16} />
                        }
                        label={
                          deworming.emailNotificationEnabled
                            ? t('Notifications ON')
                            : t('Notifications OFF')
                        }
                        size="small"
                        color={notificationStatus.color as any}
                        variant="outlined"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </Tooltip>

                    {/* Indicador de días de anticipación */}
                    {deworming.emailNotificationEnabled &&
                      !isOverdue(deworming.nextDewormingDate) && (
                        <Chip
                          icon={
                            <Iconify icon="mdi:calendar-clock" width={16} />
                          }
                          label={t(
                            'Reminder: {{notificationDays}} days in advance',
                            { notificationDays }
                          )}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      )}
                  </Stack>

                  <Stack spacing={1}>
                    <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Application date')}:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(deworming.dateOfApplication)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Next deworming')}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              isUpcoming(deworming.nextDewormingDate) ||
                              isOverdue(deworming.nextDewormingDate)
                                ? 'bold'
                                : 'normal',
                            color: getDateColor(deworming.nextDewormingDate),
                          }}
                        >
                          {formatDate(deworming.nextDewormingDate)}
                          {!isOverdue(deworming.nextDewormingDate) && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ ml: 1, color: 'text.secondary' }}
                            >
                              ({getDaysLabel(daysUntil, t)})
                            </Typography>
                          )}
                        </Typography>
                      </Box>

                      {/* Información de notificación */}
                      {deworming.emailNotificationEnabled &&
                        !isOverdue(deworming.nextDewormingDate) && (
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              📧 {t('Next notification')}
                            </Typography>
                            <Typography variant="body2" color="info.main">
                              {daysUntil <= notificationDays && daysUntil >= 0
                                ? t(
                                    'Will be sent soon (in {{daysUntil}} days)',
                                    {
                                      daysUntil,
                                    }
                                  )
                                : t(
                                    '{{notificationDays}} days before the event',
                                    {
                                      notificationDays,
                                    }
                                  )}
                            </Typography>
                          </Box>
                        )}
                    </Stack>

                    {deworming.observations && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Remarks')}:
                        </Typography>
                        <Typography variant="body2">
                          {deworming.observations}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Barra de progreso de notificación */}
                  {deworming.emailNotificationEnabled &&
                    !isOverdue(deworming.nextDewormingDate) && (
                      <Box sx={{ mt: 2 }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            📅 {t('Scheduled alert')}:
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 4,
                                bgcolor: 'action.hover',
                                borderRadius: 2,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      ((notificationDays -
                                        Math.min(daysUntil, notificationDays)) /
                                        notificationDays) *
                                        100
                                    )
                                  )}%`,
                                  height: '100%',
                                  bgcolor: getProgressBarColor(
                                    daysUntil,
                                    notificationDays
                                  ),
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {daysUntil <= notificationDays
                              ? `${Math.round(
                                  ((notificationDays - daysUntil) /
                                    notificationDays) *
                                    100
                                )}%`
                              : t('Waiting...')}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                </Box>

                <IconButton
                  onClick={() => onEdit('deworming', deworming)}
                  sx={{ ml: 1 }}
                  size="small"
                >
                  <Iconify icon="mdi:pencil" />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
