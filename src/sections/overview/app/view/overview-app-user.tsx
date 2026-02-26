/* eslint-disable no-nested-ternary */

'use client';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IUser, IPetProfile } from '@/types/api';
import { useBoolean } from '@/hooks/use-boolean';
import { useManagerUser } from '@/hooks/use-manager-user';
import { PetsGrid } from '@/app/[lang]/pet/_components/cards/pet-grid';
import {
  UserQueryParams,
  useGetAllPetsByUser,
} from '@/hooks/use-fetch-paginated';
import PetQuickEditForm from '@/app/[lang]/dashboard/admin/users/_components/pet-quick-edit-form';
import RegisterPetByUserModal from '@/app/[lang]/pet/_components/modals/register-pet-by-user-modal';

import {
  Box,
  Card,
  Alert,
  Avatar,
  Container,
  Typography,
  CardContent,
} from '@mui/material';

export default function OverviewAppUser() {
  const { user } = useManagerUser();
  const { t } = useTranslation();

  const router = useRouter();
  const [petSelected, setPetSelected] = useState<IPetProfile>();
  const petQuickEdit = useBoolean();
  const registerPetModal = useBoolean();

  const [activeFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 3,
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
        <Alert
          severity="error"
          onClose={() => {
            window.location.reload();
          }}
        >
          {t('Error loading user data')}
        </Alert>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(error.message)}</Alert>
      </Box>
    );
  }

  const comingSoon = (
    <CardContent>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t('Coming Soon!')}
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        {t('We are currently working hard on this page!')}
      </Typography>
    </CardContent>
  );

  return (
    <Box
      sx={{
        pb: 8,
      }}
    >
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {/* User Profile Card */}
        <Card
          sx={{
            backgroundColor: 'backgound.paper',
            borderRadius: 4,
            mb: 3,
            position: 'relative',
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={user.photoURL} sx={{ width: 60, height: 60 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {t('Hi there!')}, {user.displayName}
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
              {t('Your pets')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'inherit', cursor: 'pointer' }}
              onClick={() => HandleRedirect(paths.dashboard.user.myPets)}
            >
              {t('View all')}
            </Typography>
          </Box>

          <Box>
            <PetsGrid
              isFetching={isFetching}
              usersData={usersData?.payload}
              skeletonCount={3}
              onPetDelete={handlePetDelete}
              onPetView={handlePetView}
              onPetEdit={handlePetEdit}
              emptyMessage={t('No pets found. Add your first pet!')}
              showAddMoreButton={usersData && usersData.payload.length <= 2}
              onAddMore={() => registerPetModal.onTrue()}
              addMoreButtonText={t('Add New Pet')}
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
              {t('Pet Care Nearby')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'inherit', cursor: 'pointer' }}
            >
              {t('View all')}
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

            {comingSoon}
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
              {t('Next Dates')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'inherit', cursor: 'pointer' }}
            >
              {t('View all')}
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

            {comingSoon}
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
