// components/dashboard/user/upcoming-appointments-card.tsx
import Iconify from '@/components/iconify';
import { IUpcomingAppointment } from '@/types/api';
import { useTranslation } from '@/hooks/use-translation';

import {
  Box,
  Card,
  Chip,
  Grid,
  alpha,
  Button,
  Divider,
  useTheme,
  Skeleton,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

interface UpcomingAppointmentsCardProps {
  appointments: IUpcomingAppointment[];
  onViewAll?: () => void;
  onAppointmentClick?: (appointment: IUpcomingAppointment) => void;
  onAddAppointment?: () => void;
  maxItems?: number; // Número máximo de citas a mostrar
  isLoading: boolean;
}

// Mapeo de iconos por tipo de cita
const getAppointmentIcon = (type: IUpcomingAppointment['type']) => {
  const icons = {
    vaccine: 'mdi:needle',
    deworming: 'mdi:pill',
    medical_visit: 'mdi:stethoscope',
  };
  return icons[type] || 'mdi:calendar-clock';
};

// Mapeo de colores por tipo de cita
const getAppointmentColor = (type: IUpcomingAppointment['type']) => {
  const colors = {
    vaccine: '#FF6B6B',
    deworming: '#4ECDC4',
    medical_visit: '#95E77E',
  };
  return colors[type] || '#6C5CE7';
};

// Obtener color de estado
const getStatusColor = (status: IUpcomingAppointment['status'], theme: any) => {
  const colors = {
    today: theme.palette.error.main,
    upcoming: theme.palette.warning.main,
    overdue: theme.palette.text.disabled,
  };
  return colors[status] || theme.palette.text.secondary;
};

// Obtener texto de estado
const getStatusLabel = (
  status: IUpcomingAppointment['status'],
  daysUntil: number,
  t: any
) => {
  switch (status) {
    case 'today':
      return t('Today');
    case 'overdue':
      return t('Overdue');
    default:
      if (daysUntil === 1) return t('Tomorrow');
      return t('In {{days}} days', { days: daysUntil });
  }
};

export function UpcomingAppointmentsCard({
  appointments,
  onViewAll,
  onAppointmentClick,
  onAddAppointment,
  maxItems = 3,
  isLoading,
}: UpcomingAppointmentsCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  // Mapeo de etiquetas por tipo de cita
  const getAppointmentLabel = (type: IUpcomingAppointment['type']) => {
    const labels = {
      vaccine: t('Vaccination'),
      deworming: t('Deworming'),
      medical_visit: t('Medical Visit'),
    };
    return labels[type] || t('Appointment');
  };
  // Ordenar citas: hoy primero, luego próximas, luego vencidas
  const sortedAppointments = [...appointments].sort((a, b) => {
    const order = { today: 0, upcoming: 1, overdue: 2 };
    const orderA = order[a.status] || 1;
    const orderB = order[b.status] || 1;

    if (orderA !== orderB) return orderA - orderB;

    // Misma prioridad, ordenar por fecha
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const displayAppointments = sortedAppointments.slice(0, maxItems);
  const hasMore = appointments.length > maxItems;

  // Estadísticas rápidas
  const todayCount = appointments.filter((a) => a.status === 'today').length;
  const overdueCount = appointments.filter(
    (a) => a.status === 'overdue'
  ).length;
  if (isLoading) {
    return (
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((_, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Skeleton
                    variant="circular"
                    width={48}
                    height={48}
                    sx={{ mx: 'auto', mb: 1.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{ mx: 'auto', mb: 0.5 }}
                  />
                  <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify
              icon="mdi:calendar-clock"
              sx={{ fontSize: 24, color: 'primary.main' }}
            />
            <Typography variant="subtitle1" fontWeight={600}>
              {t('Upcoming Appointments')}
            </Typography>
            {(todayCount > 0 || overdueCount > 0) && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {todayCount > 0 && (
                  <Chip
                    label={`${todayCount} ${t('today')}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                    }}
                  />
                )}
                {overdueCount > 0 && (
                  <Chip
                    label={`${overdueCount} ${t('overdue')}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: alpha(theme.palette.text.disabled, 0.1),
                      color: theme.palette.text.disabled,
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {onAddAppointment && (
              <IconButton
                size="small"
                onClick={onAddAppointment}
                sx={{ p: 0.5 }}
              >
                <Iconify icon="mdi:plus" fontSize={18} />
              </IconButton>
            )}
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
              onClick={onViewAll}
            >
              {t('View all')} →
            </Typography>
          </Box>
        </Box>

        {/* Empty State */}
        {appointments.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              cursor: 'pointer',
            }}
            onClick={onAddAppointment}
          >
            <Iconify
              icon="mdi:calendar-blank"
              sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('No upcoming appointments')}
            </Typography>
            <Button
              size="small"
              sx={{ mt: 1, textTransform: 'none' }}
              onClick={onAddAppointment}
            >
              {t('Schedule appointment')}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {displayAppointments.map((appointment, index) => {
              const appointmentDate = new Date(appointment.date);
              const formattedDate = appointmentDate.toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                }
              );

              const isToday = appointment.status === 'today';
              const isOverdue = appointment.status === 'overdue';

              return (
                <Box key={appointment.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover', borderRadius: 1.5 },
                      p: 1,
                      transition: 'all 0.2s',
                      opacity: isOverdue ? 0.6 : 1,
                    }}
                    onClick={() => onAppointmentClick?.(appointment)}
                  >
                    {/* Icono */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1.5,
                        bgcolor: alpha(
                          getAppointmentColor(appointment.type),
                          0.15
                        ),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Iconify
                        icon={getAppointmentIcon(appointment.type)}
                        sx={{
                          fontSize: 24,
                          color: getAppointmentColor(appointment.type),
                        }}
                      />
                    </Box>

                    {/* Contenido */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            textDecoration: isOverdue ? 'line-through' : 'none',
                          }}
                        >
                          {getAppointmentLabel(appointment.type)}
                        </Typography>
                        <Chip
                          label={getStatusLabel(
                            appointment.status,
                            appointment.daysUntil,
                            t
                          )}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: alpha(
                              getStatusColor(appointment.status, theme),
                              0.1
                            ),
                            color: getStatusColor(appointment.status, theme),
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        {t(appointment.title)}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'wrap',
                          mt: 0.5,
                        }}
                      >
                        {/* Fecha */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Iconify
                            icon={
                              isToday ? 'mdi:calendar-today' : 'mdi:calendar'
                            }
                            sx={{ fontSize: 10, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formattedDate}
                          </Typography>
                        </Box>

                        {/* Mascota */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Iconify
                            icon="mdi:paw"
                            sx={{ fontSize: 10, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {appointment.petName}
                          </Typography>
                        </Box>

                        {/* Días restantes (solo si no es hoy ni vencido) */}
                        {!isToday &&
                          !isOverdue &&
                          appointment.daysUntil > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <Iconify
                                icon="mdi:clock-outline"
                                sx={{ fontSize: 10, color: 'text.secondary' }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {appointment.daysUntil === 1
                                  ? t('Tomorrow')
                                  : t('In {{days}} days', {
                                      days: appointment.daysUntil,
                                    })}
                              </Typography>
                            </Box>
                          )}
                      </Box>

                      {/* Veterinario (si existe) */}
                      {appointment.veterinarian && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <Iconify
                            icon="mdi:doctor"
                            sx={{ fontSize: 10, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Dr. {appointment.veterinarian}
                          </Typography>
                        </Box>
                      )}

                      {/* Ubicación (si existe) */}
                      {appointment.location && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.25,
                          }}
                        >
                          <Iconify
                            icon="eva:pin-fill"
                            sx={{ fontSize: 10, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {appointment.location}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  {index < displayAppointments.length - 1 && (
                    <Divider sx={{ my: 0.5 }} />
                  )}
                </Box>
              );
            })}

            {/* Ver más */}
            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button
                  size="small"
                  onClick={onViewAll}
                  sx={{ textTransform: 'none' }}
                >
                  {t('View {{count}} more', {
                    count: appointments.length - maxItems,
                  })}{' '}
                  →
                </Button>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
