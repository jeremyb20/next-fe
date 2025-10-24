'use client';

import { useSnackbar } from 'notistack';
import { useMemo, useState, useCallback } from 'react';
import { useResponsive } from '@/src/hooks/use-responsive';
import { useManagerUser } from '@/src/hooks/use-manager-user';
import { useSettingsContext } from '@/src/components/settings';
import FilterToolbar from '@/src/components/filters/filter-toolbar';
import { PET_FILTER_TOOLBAR } from '@/src/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetAllPetsByUser,
} from '@/src/hooks/use-fetch-paginated';

import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { Card, Stack, Alert, Container, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { isAfter } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import UserCardList from './user-card-list';
// ----------------------------------------------------------------------

export default function UserPetCardsView() {
  const { user } = useManagerUser();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('down', 'sm');

  const settings = useSettingsContext();

  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 5,
    id: user?.id,
  });

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

  if (isError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Alert severity="error">Error loading users: {error?.message}</Alert>
        </Card>
      </Container>
    );
  }

  return (
    <Box>
      <Box>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 1, md: 3 }, width: '100%' }}
        >
          <FilterToolbar
            filters={activeFilters}
            onFilters={handleFiltersChange}
            filterConfig={PET_FILTER_TOOLBAR}
            dateError={dateError}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Pet
          </Button>
        </Stack>

        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          Mascotas registradas:{' '}
          {isFetching ? <CircularProgress /> : usersData?.payload.length}{' '}
        </Box>

        <UserCardList pets={usersData ? usersData.payload : []} />
      </Box>
    </Box>
  );
}
