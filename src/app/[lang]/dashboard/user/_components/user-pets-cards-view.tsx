'use client';

import { paths } from '@/routes/paths';
import { useSnackbar } from 'notistack';
import { useRouter } from '@/routes/hooks';
import { useState, useCallback } from 'react';
import { IUser, IPetProfile } from '@/types/api';
import { useBoolean } from '@/hooks/use-boolean';
import { useTranslation } from '@/hooks/use-translation';
import { ALLOW_MAX_PETS_BY_USER } from '@/config-global';
import { useManagerUser } from '@/hooks/use-manager-user';
import { useSettingsContext } from '@/components/settings';
import { UserProfileCard } from '@/components/cards/user-profile-card';
import {
  UserQueryParams,
  useGetAllPetsByUser,
} from '@/hooks/use-fetch-paginated';
import RegisterPetByUserModal from '@/app/[lang]/pet/_components/modals/register-pet-by-user-modal';

import { Card, Alert, Container } from '@mui/material';

import { PetDashboard } from './pet-dashboard';
import PetQuickEditForm from '../../admin/users/_components/pet-quick-edit-form';

// ----------------------------------------------------------------------
export default function UserPetCardsView() {
  const { user } = useManagerUser();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const petQuickEdit = useBoolean();
  const registerPetModal = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const [activeFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 10,
    id: user?.id,
  });
  const [petSelected] = useState<IPetProfile>();

  const {
    data: usersData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllPetsByUser(activeFilters);

  const handlePetDelete = (pet: IPetProfile) => {
    enqueueSnackbar(t('Coming Soon!'), {
      variant: 'info',
    });
  };

  const handlePetView = useCallback(
    (pet: IPetProfile) => {
      // Forzar la recarga del componente agregando un timestamp o key único
      router.push(`${paths.dashboard.user.details(pet.memberPetId)}`);
    },
    [router]
  );

  const handlePetEdit = useCallback(
    (pet: IPetProfile) => {
      router.push(`${paths.dashboard.user.edit(pet.memberPetId)}`);
    },
    [router]
  );

  const handlePetViewDetails = useCallback(
    (pet: IPetProfile) => {
      router.push(`${paths.dashboard.user.details(pet.memberPetId)}`);
    },
    [router]
  );

  if (isError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Alert severity="error"> {t(error?.message)}</Alert>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'sm'} sx={{ pb: 6 }}>
      <UserProfileCard
        petCount={`${
          usersData?.payload.length || 0
        } / ${ALLOW_MAX_PETS_BY_USER}`}
        isFetching={isFetching}
        greetingText="My Pets"
        decorativeImage="/assets/images/paw-cat.png"
        decorativeImageSx={{
          zIndex: 0,
          opacity: 0.3,
        }}
        cardSx={{ mb: 4 }}
        onAvatarClick={() => router.push(paths.dashboard.user.account)}
      />

      <PetDashboard
        isFetching={isFetching}
        usersData={usersData?.payload}
        onPetDelete={handlePetDelete}
        onPetView={handlePetView}
        onPetEdit={handlePetEdit}
        onViewDetails={handlePetViewDetails}
        onAddMore={() => registerPetModal.onTrue()}
        emptyMessage="No se encontraron mascotas"
        refetch={refetch}
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
    </Container>
  );
}
