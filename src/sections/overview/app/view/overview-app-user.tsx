/* eslint-disable no-nested-ternary */

'use client';

import { paths } from '@/src/routes/paths';
import { bgGradient } from '@/src/theme/css';
import { useState, useCallback } from 'react';
import Iconify from '@/src/components/iconify';
import { IUser, IPetProfile } from '@/src/types/api';
import { useBoolean } from '@/src/hooks/use-boolean';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { PetsGrid } from '@/src/app/pet/_components/cards/pet-grid';
import {
  UserQueryParams,
  useGetAllPetsByUser,
} from '@/src/hooks/use-fetch-paginated';
import PetQuickEditForm from '@/src/app/dashboard/admin/users/_components/pet-quick-edit-form';
import RegisterPetByUserModal from '@/src/app/pet/_components/modals/register-pet-by-user-modal';

import {
  Box,
  Card,
  alpha,
  Alert,
  Avatar,
  useTheme,
  Container,
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

  const [petSelected, setPetSelected] = useState<IPetProfile>();
  const petQuickEdit = useBoolean();
  const registerPetModal = useBoolean();

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
    refetch,
  } = useGetAllPetsByUser(activeFilters);

  const HandleRedirect = useCallback(
    (redirectTo: string) => {
      router.push(redirectTo);
    },
    [router]
  );

  const handlePetDelete = (pet: IPetProfile) => {
    console.log('Eliminar mascota:', pet);
  };

  const handlePetView = useCallback(
    (pet: IPetProfile) => {
      console.log('Ver mascota:', pet);
      router.push(paths.dashboard.user.details(pet.memberPetId));
    },
    [router]
  );

  const handlePetEdit = (pet: IPetProfile) => {
    setPetSelected(pet);
    petQuickEdit.onTrue();
  };

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

          <Box>
            <PetsGrid
              isFetching={isFetching}
              usersData={usersData?.payload}
              skeletonCount={(usersData && usersData.payload.length) || 2}
              onPetDelete={handlePetDelete}
              onPetView={handlePetView}
              onPetEdit={handlePetEdit}
              emptyMessage="No se encontraron mascotas"
              showAddMoreButton={usersData && usersData.payload.length <= 9}
              onAddMore={() => registerPetModal.onTrue()}
              addMoreButtonText="Add Pet"
            />

            <PetQuickEditForm
              currentUser={user as unknown as IUser}
              currentPet={petSelected}
              open={petQuickEdit.value}
              onClose={petQuickEdit.onFalse}
              refetch={refetch}
            />

            <RegisterPetByUserModal
              currentUser={user as unknown as IUser}
              open={registerPetModal.value}
              onClose={registerPetModal.onFalse}
              refetch={refetch}
            />
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
              bgcolor: 'background.paper',
              color: '#fff',
            }}
          >
            {/* <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  
                  <Logo />
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
            </CardContent> */}

            <CardContent>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Coming Soon!
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                We are currently working hard on this page!
              </Typography>
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
            {/* <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Iconify icon="mdi:needle" sx={{ width: 50, height: 50 }} />
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
            </CardContent> */}

            <CardContent>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Coming Soon!
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                We are currently working hard on this page!
              </Typography>
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
