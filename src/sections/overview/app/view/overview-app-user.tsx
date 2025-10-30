/* eslint-disable no-nested-ternary */

'use client';

import { paths } from '@/src/routes/paths';
import { bgGradient } from '@/src/theme/css';
import { useState, useCallback } from 'react';
import Iconify from '@/src/components/iconify';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import {
  UserQueryParams,
  useGetAllPetsByUser,
} from '@/src/hooks/use-fetch-paginated';

import {
  Box,
  Card,
  Chip,
  alpha,
  Alert,
  Avatar,
  useTheme,
  Skeleton,
  Container,
  IconButton,
  Typography,
  CardContent,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

export default function OverviewAppUser() {
  const { user } = useManagerUser();
  const theme = useTheme();
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 5,
    id: user?.id,
  });
  const {
    data: usersData,
    isFetching,
    isError,
    error,
  } = useGetAllPetsByUser(activeFilters);

  const HandleRedirect = useCallback(
    (redirectTo: string) => {
      router.push(redirectTo);
    },
    [router]
  );

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading user data</Alert>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pb: 8,
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {/* User Profile Card */}
        <Card
          sx={{
            ...bgGradient({
              direction: '135deg',
              startColor: alpha(theme.palette.primary.light, 0.2),
              endColor: alpha(theme.palette.primary.main, 0.2),
            }),
            borderRadius: 4,
            mb: 3,
            position: 'relative',
            color: 'primary.darker',
            backgroundColor: 'common.white',
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={user.photoURL} sx={{ width: 60, height: 60 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Hi, {user.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Your Pets Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Your pets
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'inherit', cursor: 'pointer' }}
              onClick={() => HandleRedirect(paths.dashboard.user.myPets)}
            >
              See all
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {isFetching ? (
              // Skeletons mientras carga
              Array.from({
                length: (usersData && usersData.payload.length) || 2,
              }).map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  sx={{
                    flex: 1,
                    borderRadius: 4,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Skeleton variant="circular" width={80} height={80} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="80%" height={24} />
                  </CardContent>
                </Card>
              ))
            ) : usersData ? (
              // Cards de mascotas cuando hay datos
              usersData.payload?.map((pet, index) => (
                <Card
                  key={pet._id || `pet-${index}`}
                  sx={{
                    flex: 1,
                    borderRadius: 4,
                    bgcolor: 'background.neutral',
                    position: 'relative',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={pet.photo || `/default-pet-${index + 1}.jpg`}
                        sx={{ width: 80, height: 80 }}
                        alt={pet.petName}
                      />
                      <IconButton size="small" sx={{ color: '#fff' }}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {pet.petName || 'No name'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {pet.race || 'Unknown breed'}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Mensaje cuando no hay mascotas
              <Box sx={{ flex: 1, textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No pets found
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Pet Care Nearby Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Pet Care Nearby
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'inherit', cursor: 'pointer' }}
            >
              See all
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 4,
              bgcolor: '#8B7B6B',
              color: '#fff',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    src="/pet-care-logo.jpg"
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Animal Pet Care
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Iconify icon="eva:location-fill" />
                      <Typography variant="body2">1.3 km</Typography>
                      <Iconify icon="eva:star-fill" />
                      <Typography variant="body2">4.2</Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton size="small" sx={{ color: '#fff' }}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Bathing"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                <Chip
                  label="Nail"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                <Chip
                  label="Teeth"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Next Dates */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              my: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Next Dates
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'inherit', cursor: 'pointer' }}
            >
              See all
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 4,
              bgcolor: 'background.paper',
              color: '#fff',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    src="/pet-care-logo.jpg"
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Reminder For Vaccination
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify icon="eva:location-fill" />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton size="small" sx={{ color: '#fff' }}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Bottom Navigation */}
      <BottomNavigation
        showLabels={false}
        sx={{
          position: 'fixed',
          display: { xs: 'flex', md: 'none' },
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          bgcolor: '#000',
          borderRadius: 8,
          px: 2,
          '& .MuiBottomNavigationAction-root': {
            color: '#fff',
            minWidth: 60,
          },
          '& .Mui-selected': {
            bgcolor: '#fff',
            color: '#000',
            borderRadius: '50%',
          },
        }}
      >
        <BottomNavigationAction icon={<Iconify icon="solar:home-2-linear" />} />
        <BottomNavigationAction
          icon={<Iconify icon="solar:calendar-linear" />}
        />
        <BottomNavigationAction icon={<Iconify icon="eva:search-fill" />} />
      </BottomNavigation>
    </Box>
  );
}
