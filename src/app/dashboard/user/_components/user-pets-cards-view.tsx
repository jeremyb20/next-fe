/* eslint-disable no-nested-ternary */

'use client';

import { useSnackbar } from 'notistack';
import { paths } from '@/src/routes/paths';
import { IUser, IPetProfile } from '@/src/types/api';
import { useBoolean } from '@/src/hooks/use-boolean';
import { useMemo, useState, useCallback } from 'react';
import { useResponsive } from '@/src/hooks/use-responsive';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { useSettingsContext } from '@/src/components/settings';
import FilterToolbar from '@/src/components/filters/filter-toolbar';
import { PetsGrid } from '@/src/app/pet/_components/cards/pet-grid';
import { PET_FILTER_TOOLBAR } from '@/src/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetAllPetsByUser,
} from '@/src/hooks/use-fetch-paginated';

import { Box } from '@mui/system';
import {
  Card,
  Alert,
  Avatar,
  Backdrop,
  Container,
  SpeedDial,
  Typography,
  CardContent,
  SpeedDialAction,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { isAfter } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PetQuickEditForm from '../../admin/users/_components/pet-quick-edit-form';

// ----------------------------------------------------------------------
const actions = [{ icon: 'tabler:paw', name: 'Pet', color: '#ffffff' }];
export default function UserPetCardsView() {
  const { user } = useManagerUser();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { enqueueSnackbar } = useSnackbar();

  const petQuickEdit = useBoolean();

  const router = useRouter();

  const smUp = useResponsive('up', 'sm');

  const settings = useSettingsContext();

  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 5,
    id: user?.id,
  });
  const [petSelected, setPetSelected] = useState<IPetProfile>();

  const dateError = useMemo(() => {
    const startDate = activeFilters.startDate
      ? new Date(activeFilters.startDate)
      : null;
    const endDate = activeFilters.endDate
      ? new Date(activeFilters.endDate)
      : null;
    return isAfter(startDate, endDate);
  }, [activeFilters.startDate, activeFilters.endDate]);

  const {
    data: usersData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllPetsByUser(activeFilters);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<UserQueryParams>) => {
      setActiveFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const handleClear = useCallback(() => {
    const clearedFilters = {
      page: 1,
      limit: activeFilters.limit || 5,
      id: user?.id,
    };

    setActiveFilters(clearedFilters);
    enqueueSnackbar('Filtros limpiados', { variant: 'info' });
  }, [activeFilters.limit, enqueueSnackbar, user?.id]);

  const handleSearch = useCallback(() => {
    setActiveFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    enqueueSnackbar('Búsqueda realizada', { variant: 'success' });
  }, [enqueueSnackbar]);

  const handlePetDelete = (pet: IPetProfile) => {
    console.log('Eliminar mascota:', pet);
  };

  // const handlePetView = (pet: IPetProfile) => {
  //   console.log('Ver mascota:', pet);
  // };

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

  if (isError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Alert severity="error">Error loading pets: {error?.message}</Alert>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
          position: 'relative',
          color: 'inherit',
          backgroundColor: 'backgound.paper',
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.photoURL} sx={{ width: 60, height: 60 }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Hi, {user.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pets Registered:{' '}
              {isFetching ? <CircularProgress /> : usersData?.payload.length}{' '}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ my: 2 }}>
        <FilterToolbar
          filters={activeFilters}
          onFilters={handleFiltersChange}
          filterConfig={PET_FILTER_TOOLBAR}
          dateError={dateError}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </Box>

      <PetsGrid
        isFetching={isFetching}
        usersData={usersData?.payload}
        skeletonCount={(usersData && usersData.payload.length) || 2}
        onPetDelete={handlePetDelete}
        onPetView={handlePetView}
        onPetEdit={handlePetEdit}
        emptyMessage="No se encontraron mascotas"
      />

      <PetQuickEditForm
        currentUser={user as unknown as IUser}
        currentPet={petSelected}
        open={petQuickEdit.value}
        onClose={petQuickEdit.onFalse}
        refetch={refetch}
      />

      <Box
        sx={{
          position: 'fixed',
          display: { xs: 'flex' },
          bottom: 20,
          right: 20,
          transform: 'translateZ(0px)',
          width: 'auto',
          bgcolor: '#000',
        }}
      >
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<Iconify icon="mingcute:add-line" />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={<Iconify icon={action.icon} sx={{ color: action.color }} />}
              tooltipTitle={action.name}
              tooltipOpen
              FabProps={{ color: 'default' }}
              onClick={handleClose}
            />
          ))}
        </SpeedDial>
      </Box>
    </Container>
  );
}
