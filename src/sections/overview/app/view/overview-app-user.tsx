'use client';

import { IUser } from '@/types/api';
import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { useState, useCallback } from 'react';
import { useBoolean } from '@/hooks/use-boolean';
import { useGetUserPetStats } from '@/hooks/use-fetch';
import { useTranslation } from '@/hooks/use-translation';
import { useManagerUser } from '@/hooks/use-manager-user';
import RegisterPetByUserModal from '@/app/[lang]/pet/_components/modals/register-pet-by-user-modal';
import {
  UserQueryParams,
  useGetActivePromotions,
  useGetUserUpcomingAppointments,
} from '@/hooks/use-fetch-paginated';

import {
  Box,
  Card,
  Grid,
  Alert,
  Paper,
  Avatar,
  useTheme,
  Container,
  Typography,
  CardContent,
  useMediaQuery,
} from '@mui/material';

import { QuickActions } from './components/quick-actions';
import { StatisticsCards } from './components/statistics-cards';
import { PromotionsCardCaroussell } from './components/promotions-carousell';
import { UpcomingAppointmentsCard } from './components/upcoming-appointments-card';

export default function OverviewAppUser() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { user } = useManagerUser();
  const { t } = useTranslation();
  const router = useRouter();
  const registerPetModal = useBoolean();
  const [activeFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: Number(process.env.NEXT_PUBLIC_ALLOW_MAX_PETS_BY_USER) || 10,
    id: user?.id,
  });

  const {
    data: appointments,
    isFetching: isLoading,
    isError: isMedicalError,
    error: medicalError,
  } = useGetUserUpcomingAppointments(activeFilters);

  const { data: promotionsData } = useGetActivePromotions();

  const {
    data: statsData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUserPetStats();

  const handleRedirect = useCallback(
    (redirectTo: string) => {
      router.push(redirectTo);
    },
    [router]
  );

  const handleAddPet = () => {
    registerPetModal.onTrue();
  };

  const handleAddAppointment = useCallback(() => {
    handleRedirect(paths.dashboard.user.pets);
  }, [handleRedirect]);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('Error loading user data')}</Alert>
      </Box>
    );
  }

  const comingSoon = (
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
        🐕 {t('Coming Soon!')}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {t('We are currently working hard on this feature!')}
      </Typography>
    </CardContent>
  );

  // Determinar el espaciado según el tamaño de pantalla
  const getSpacing = () => {
    if (isMobile) return 1.5;
    if (isTablet) return 2;
    return 2.5;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={{ py: { xs: 2, md: 3 } }}>
        <Grid container spacing={getSpacing()}>
          {/* Fila 1: Perfil de Usuario + App Featured */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent
                sx={{
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={user.photoURL}
                  sx={{
                    width: 52,
                    height: 52,
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    👋 {t('Hi there!')}, {user.displayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            {isError ? (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">
                  {t(error?.message || 'Error loading pets')}
                </Alert>
              </Box>
            ) : (
              <StatisticsCards
                petsCount={statsData?.petsCount || 0}
                vaccinationsCount={statsData?.vaccinationsCount || 0}
                appointmentsCount={statsData?.appointmentsCount || 0}
                vetVisitsCount={statsData?.vetVisitsCount || 0}
                petsNeedingVaccination={statsData?.petsNeedingVaccination || 0}
                upcomingAppointments={statsData?.upcomingAppointments || 0}
                isLoading={isFetching}
              />
            )}
          </Grid>

          {/* Fila 2: Quick Actions + Promotions */}
          <Grid item xs={12}>
            <QuickActions
              onAddPet={handleAddPet}
              onMyPets={() => handleRedirect(paths.dashboard.user.pets)}
              onFindVet={() => handleRedirect(paths.dashboard.user.pets)}
              onShare={() => console.log('Share app')}
            />
          </Grid>

          <Grid item xs={12}>
            <PromotionsCardCaroussell
              promotions={promotionsData?.payload || []}
              onViewOffer={(promotion) => {
                console.log('View offer:', promotion);
                handleRedirect(promotion.link);
              }}
              autoplay
              autoplaySpeed={5000}
            />
          </Grid>

          {/* Fila 4: Upcoming Appointments - Ocupa todo el ancho */}
          <Grid item xs={12}>
            {isMedicalError ? (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">
                  {t(medicalError?.message || 'Error loading appointments')}
                </Alert>
              </Box>
            ) : (
              <UpcomingAppointmentsCard
                appointments={appointments?.payload?.appointments || []}
                onViewAll={() => handleRedirect(paths.dashboard.user.pets)}
                onAppointmentClick={(appointment) => {
                  console.log('Appointment clicked:', appointment);
                }}
                onAddAppointment={handleAddAppointment}
                isLoading={isLoading}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                bgcolor: 'background.paper',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    🏥 {t('Pet Care Nearby')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                    onClick={() => handleRedirect(paths.dashboard.user.pets)}
                  >
                    {t('View all')} →
                  </Typography>
                </Box>
              </Box>
              {comingSoon}
            </Paper>
          </Grid>
        </Grid>

        <RegisterPetByUserModal
          currentUser={user as unknown as IUser}
          open={registerPetModal.value}
          onClose={registerPetModal.onFalse}
          refetch={refetch}
        />
      </Container>
    </Box>
  );
}
