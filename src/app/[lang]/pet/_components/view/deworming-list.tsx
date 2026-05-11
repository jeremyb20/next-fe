// components/medical-records/deworming-list.tsx
import React from 'react';
import Iconify from '@/components/iconify';
import { IDewormingFormData } from '@/interfaces/medical-record';

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
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <CircularProgress />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Cargando desparasitaciones...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    return date >= today && date <= next30Days;
  };

  const isOverdue = (dateString: string) => new Date(dateString) < new Date();

  const getProgressBarColor = (days: number, notifDays: number) => {
    if (days > notifDays) return 'info.main';
    if (days <= 3) return 'error.main';
    return 'warning.main';
  };

  const getNextDewormingDateColor = (dateString: string) => {
    if (isOverdue(dateString)) return 'error.main';
    if (isUpcoming(dateString)) return 'warning.main';
    return 'inherit';
  };

  const getDaysLabel = (days: number) => {
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    return `en ${days} días`;
  };

  // Calcular días hasta la próxima desparasitación
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays;
  };

  // Verificar si la notificación está activa y próxima a enviarse
  const getNotificationStatus = (deworming: IDewormingFormData) => {
    if (!deworming.emailNotificationEnabled) {
      return {
        active: false,
        message: 'Notificaciones desactivadas',
        icon: 'mdi:bell-off-outline',
        color: 'default',
      };
    }

    const daysUntil = getDaysUntil(deworming.nextDewormingDate);
    const notificationDays = deworming.notificationDaysBefore || 7;

    if (daysUntil <= notificationDays && daysUntil >= 0) {
      return {
        active: true,
        message: `Te notificaremos en ${daysUntil} días (configurado para ${notificationDays} días antes)`,
        icon: 'mdi:bell-ring-outline',
        color: 'warning',
      };
    }

    if (daysUntil < 0) {
      return {
        active: false,
        message: 'Fecha vencida - las notificaciones están pausadas',
        icon: 'mdi:bell-off-outline',
        color: 'error',
      };
    }

    return {
      active: true,
      message: `Notificaciones activas - Te avisaremos ${notificationDays} días antes`,
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
              No hay desparasitaciones registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Comienza agregando la primera desparasitación de tu mascota
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
                        label="PRÓXIMA"
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    {isOverdue(deworming.nextDewormingDate) && (
                      <Chip
                        label="VENCIDA"
                        size="small"
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    {/* Badge de notificaciones */}
                    <Tooltip title={notificationStatus.message}>
                      <Chip
                        icon={
                          <Iconify icon={notificationStatus.icon} width={16} />
                        }
                        label={
                          deworming.emailNotificationEnabled
                            ? 'Notificaciones ON'
                            : 'Notificaciones OFF'
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
                          label={`Alerta: ${notificationDays} días antes`}
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
                          Fecha de aplicación:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(deworming.dateOfApplication)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Próxima desparasitación:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              isUpcoming(deworming.nextDewormingDate) ||
                              isOverdue(deworming.nextDewormingDate)
                                ? 'bold'
                                : 'normal',
                            color: getNextDewormingDateColor(
                              deworming.nextDewormingDate
                            ),
                          }}
                        >
                          {formatDate(deworming.nextDewormingDate)}
                          {!isOverdue(deworming.nextDewormingDate) && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ ml: 1, color: 'text.secondary' }}
                            >
                              ({getDaysLabel(daysUntil)})
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
                              📧 Próxima notificación:
                            </Typography>
                            <Typography variant="body2" color="info.main">
                              {daysUntil <= notificationDays && daysUntil >= 0
                                ? `Se enviará pronto (faltan ${daysUntil} días)`
                                : `${notificationDays} días antes del evento`}
                            </Typography>
                          </Box>
                        )}
                    </Stack>

                    {deworming.observations && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Observaciones:
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
                            📅 Alerta programada:
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
                              : 'Esperando...'}
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
