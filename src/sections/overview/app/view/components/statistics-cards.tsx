// components/dashboard/user/statistics-cards.tsx
import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';

import {
  Box,
  Card,
  Grid,
  useTheme,
  Skeleton,
  Typography,
  CardContent,
} from '@mui/material';

interface StatisticsCardsProps {
  petsCount: number;
  vaccinationsCount: number;
  appointmentsCount: number;
  vetVisitsCount: number;
  petsNeedingVaccination?: number;
  upcomingAppointments?: number;
  isLoading: boolean;
}

export const StatisticsCards = ({
  petsCount,
  vaccinationsCount,
  appointmentsCount,
  vetVisitsCount,
  petsNeedingVaccination,
  upcomingAppointments,
  isLoading,
}: StatisticsCardsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Estadísticas principales
  const mainStats = [
    {
      id: 'pets',
      icon: 'mdi:paw',
      label: t('Pets'),
      value: petsCount,
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}15`,
    },
    {
      id: 'vaccinations',
      icon: 'mdi:needle',
      label: t('Vaccinations'),
      value: vaccinationsCount,
      color: theme.palette.success.main,
      bgColor: `${theme.palette.success.main}15`,
    },
    {
      id: 'appointments',
      icon: 'mdi:calendar',
      label: t('Appointments'),
      value: appointmentsCount,
      color: theme.palette.info.main,
      bgColor: `${theme.palette.info.main}15`,
    },
    {
      id: 'vet-visits',
      icon: 'mdi:doctor',
      label: t('Vet Visits'),
      value: vetVisitsCount,
      color: theme.palette.warning.main,
      bgColor: `${theme.palette.warning.main}15`,
    },
  ];

  // Estadísticas adicionales (opcionales)
  const additionalStats = [];

  if (petsNeedingVaccination !== undefined && petsNeedingVaccination > 0) {
    additionalStats.push({
      id: 'needing-vaccination',
      icon: 'mdi:alert',
      label: t('Need Vaccination'),
      value: petsNeedingVaccination,
      color: theme.palette.error.main,
      bgColor: `${theme.palette.error.main}15`,
      alert: true,
    });
  }

  if (upcomingAppointments !== undefined && upcomingAppointments > 0) {
    additionalStats.push({
      id: 'upcoming',
      icon: 'mdi:calendar-clock',
      label: t('Upcoming'),
      value: upcomingAppointments,
      color: theme.palette.warning.main,
      bgColor: `${theme.palette.warning.main}15`,
    });
  }

  const allStats = [...mainStats, ...additionalStats];
  // Mostrar skeleton mientras carga
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
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {allStats.map((stat) => (
          <Grid item xs={6} sm={6} md={4} key={stat.id}>
            <Card
              sx={{
                borderRadius: 3,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 2,
                  '&:last-child': { pb: 2 },
                }}
              >
                {/* Icono centrado */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <Iconify
                    icon={stat.icon}
                    sx={{
                      fontSize: 26,
                      color: stat.color,
                    }}
                  />
                </Box>

                {/* Valor */}
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    color: 'text.primary',
                  }}
                >
                  {stat.value}
                </Typography>

                {/* Etiqueta */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>

                {/* Badge de alerta (opcional) */}
                {/* {stat.alert && (
                  <Box
                    sx={{
                      mt: 1,
                      bgcolor: `${theme.palette.error.main}20`,
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                      }}
                    >
                      {t('Needs attention')}
                    </Typography>
                  </Box>
                )} */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
