'use client';

import { IUser } from '@/types/api';
import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import Iconify from '@/components/iconify';
import useIPInfo from '@/hooks/use-ip-info';
import Scrollbar from '@/components/scrollbar';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { useSnackbar } from '@/components/snackbar';
import { useMemo, useState, useCallback } from 'react';
import EmptyContent from '@/components/empty-content';
import { isAfter, isBetween } from '@/utils/format-time';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import FilterToolbar from '@/components/filters/filter-toolbar';
import { ADMIN_USER_FILTER_TOOLBAR } from '@/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetAllRegisteredUsers,
} from '@/hooks/use-fetch-paginated';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '@/components/table';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { Box, LinearProgress } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import UserTableRow from '../user-table-row';

export interface IUserTableFilters {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

export type IUserTableFilterValue = string | Date | null;

const TABLE_HEAD = [
  { id: 'email', label: 'Email' },
  { id: 'memberId', label: 'Member ID', width: 140 },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'updatedAt', label: 'Updated', width: 140 },
  { id: 'userState', label: 'User Type', width: 120 },
  { id: 'petStatus', label: 'User State', width: 120 },
  { id: 'petCount', label: 'No. Pets', width: 100, align: 'center' },
  { id: '', width: 88 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt' });
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const { ipData } = useIPInfo();

  // SOLUCIÓN: Unificar en un solo estado para filtros y paginación
  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 5,
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
    refetch,
  } = useGetAllRegisteredUsers(activeFilters);

  const tableData: IUser[] = useMemo(
    () => usersData?.payload || [],
    [usersData?.payload]
  );

  const [filters] = useState(defaultFilters);

  // Apply client-side filtering and sorting
  const dataFiltered = useMemo(() => {
    // Primero aplicar filtros
    let filteredData = applyFilter({
      inputData: tableData,
      filters,
      dateError,
    });

    if (table.orderBy) {
      const comparator = getComparator(table.order, table.orderBy) as (
        a: any,
        b: any
      ) => number;
      filteredData = filteredData.sort(comparator);
    }

    return filteredData;
  }, [tableData, table.order, table.orderBy, filters, dateError]);

  const canReset =
    !!filters.name ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = !tableData.length || (!dataFiltered.length && canReset);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<UserQueryParams>) => {
      setActiveFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      enqueueSnackbar('Delete success!');
    },
    [enqueueSnackbar]
  );

  const handleDeleteRows = useCallback(() => {
    enqueueSnackbar('Delete success!');
    confirm.onFalse();
  }, [enqueueSnackbar, confirm]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  // SOLUCIÓN: Actualizar activeFilters en la paginación
  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setActiveFilters((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setActiveFilters((prev) => ({
        ...prev,
        limit: newRowsPerPage,
        page: 1, // Reset to first page
      }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    setActiveFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    table.onResetPage();
    enqueueSnackbar('Búsqueda realizada', { variant: 'success' });
  }, [table, enqueueSnackbar]);

  const handleClear = useCallback(() => {
    const clearedFilters = {
      page: 1,
      limit: activeFilters.limit || 5,
    };

    setActiveFilters(clearedFilters);
    table.onResetPage();
    enqueueSnackbar('Filtros limpiados', { variant: 'info' });
  }, [activeFilters.limit, table, enqueueSnackbar]);

  if (isError) {
    return (
      <EmptyContent
        filled
        title={`${error?.message}`}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.admin.usersAdmin}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Back to List
          </Button>
        }
        sx={{ py: 10 }}
      />
    );
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Users List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Users',
              href: paths.dashboard.user.root,
            },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Box sx={{ my: 2 }}>
            <FilterToolbar
              filters={activeFilters}
              onFilters={handleFiltersChange}
              filterConfig={ADMIN_USER_FILTER_TOOLBAR}
              dateError={dateError}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </Box>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      ipDataInfo={ipData}
                      refetch={refetch}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
              {isFetching ? <LinearProgress color="secondary" /> : null}
            </Scrollbar>
          </TableContainer>

          {/* SOLUCIÓN: Usar activeFilters para la paginación */}
          <TablePaginationCustom
            count={usersData?.pagination.total || 0}
            page={(activeFilters.page || 1) - 1} // Convertir a base 0 para MUI
            rowsPerPage={activeFilters.limit || 5}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{' '}
            <strong> {table.selected.length} </strong> users?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

// Función de filtrado simplificada - solo filtros, sin ordenamiento
function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: IUser[];
  filters: IUserTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

  // Si no hay filtros aplicados, devolver los datos tal cual
  if (!name && status === 'all' && !startDate && !endDate) {
    return inputData;
  }

  let filteredData = [...inputData];

  if (name) {
    filteredData = filteredData.filter((user) =>
      user.email.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter(
      (user) => user.userState.toString() === status
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((user) =>
        isBetween(new Date(user.createdAt), startDate, endDate)
      );
    }
  }

  return filteredData;
}
