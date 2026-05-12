// components/medical-records/medical-visits-list.tsx
import React from 'react';
import Iconify from '@/components/iconify';
import { formatDate } from '@/utils/format-time';
import { useTranslation } from '@/hooks/use-translation';
import { IMedicalVisitFormData } from '@/interfaces/medical-record';
import {
  isOverdue,
  isUpcoming,
  getDaysLabel,
  getDaysUntil,
  getDateColor,
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

interface MedicalVisitsListProps {
  data: IMedicalVisitFormData[];
  onEdit: (
    type: 'vaccine' | 'deworming' | 'medical_visit',
    record: IMedicalVisitFormData
  ) => void;
  refetchTrigger?: number;
  isLoading?: boolean;
}

// Mapeo de razones de visita a texto legible
const getReasonLabel = (reason: string): string => {
  const reasons: { [key: string]: string } = {
    annual_checkup: 'Chequeo anual',
    vaccination: 'Vacunación',
    deworming: 'Desparasitación',
    weight_control: 'Control de peso',
    digestive_issues: 'Problemas digestivos',
    skin_problems: 'Problemas de piel',
    injury_accident: 'Lesión o accidente',
    surgery: 'Cirugía',
    dental_care: 'Control dental',
    behavior: 'Comportamiento',
    other: 'Otro motivo',
  };
  return reasons[reason] || reason;
};

export default function MedicalVisitsList({
  data,
  onEdit,
  refetchTrigger,
  isLoading,
}: MedicalVisitsListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <CircularProgress />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              {t('Loading medical appointments...')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getNotificationStatus = (visit: IMedicalVisitFormData) => {
    if (!visit.emailNotificationEnabled) {
      return {
        active: false,
        message: 'Notifications turned off',
        icon: 'mdi:bell-off-outline',
        color: 'default',
      };
    }

    const daysUntil = getDaysUntil(visit.visitDate);
    const notificationDays = visit.notificationDaysBefore || 7;

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
              icon="mdi:calendar-blank"
              width={48}
              sx={{ opacity: 0.5, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              {t('There are no medical appointments on record')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('Start by adding your pets first vet visit')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((visit, index) => {
        const notificationStatus = getNotificationStatus(visit);
        const daysUntil = getDaysUntil(visit.visitDate);
        const notificationDays = visit.notificationDaysBefore || 7;

        return (
          <Card
            key={visit._id || index}
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
                      {getReasonLabel(visit.reasonForVisit)}
                    </Typography>

                    {isUpcoming(visit.visitDate) && (
                      <Chip
                        label={t('NEXT')}
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    {isOverdue(visit.visitDate) && (
                      <Chip
                        label={t('EXPIRED')}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    <Tooltip title={t(notificationStatus.message)}>
                      <Chip
                        icon={
                          <Iconify icon={notificationStatus.icon} width={16} />
                        }
                        label={
                          visit.emailNotificationEnabled
                            ? t('Notifications ON')
                            : t('Notifications OFF')
                        }
                        size="small"
                        color={notificationStatus.color as any}
                        variant="outlined"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </Tooltip>

                    {visit.emailNotificationEnabled &&
                      !isOverdue(visit.visitDate) && (
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
                          Fecha de visita:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              isUpcoming(visit.visitDate) ||
                              isOverdue(visit.visitDate)
                                ? 'bold'
                                : 'normal',
                            color: getDateColor(visit.visitDate),
                          }}
                        >
                          {formatDate(visit.visitDate)}
                          {!isOverdue(visit.visitDate) && (
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

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Veterinarian Name')}:
                        </Typography>
                        <Typography variant="body2">
                          {visit.veterinarianName}
                        </Typography>
                      </Box>

                      {visit.emailNotificationEnabled &&
                        !isOverdue(visit.visitDate) && (
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

                    {visit.observations && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t('Remarks')}:
                        </Typography>
                        <Typography variant="body2">
                          {visit.observations}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {visit.emailNotificationEnabled &&
                    !isOverdue(visit.visitDate) && (
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
                  onClick={() => onEdit('medical_visit', visit)}
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
