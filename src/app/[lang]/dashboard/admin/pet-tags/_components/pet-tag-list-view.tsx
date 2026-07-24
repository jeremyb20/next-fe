'use client';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { Box, LinearProgress } from '@mui/material';
import { useMemo, useState, useCallback } from 'react';
import TableContainer from '@mui/material/TableContainer';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { IPetTagOrder } from '@/types/pet-tag';
import Scrollbar from '@/components/scrollbar';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { useSnackbar } from '@/components/snackbar';
import EmptyContent from '@/components/empty-content';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useGetAllPetTags, UserQueryParams } from '@/hooks/use-fetch-paginated';
import FilterToolbar, {
  FilterConfig,
} from '@/components/filters/filter-toolbar';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '@/components/table';

import PetTagTableRow from './pet-tag-table-row';
import PetTagQuickView from './pet-tag-quick-view';

const TABLE_HEAD = [
  { id: 'contactName', label: 'Contacto' },
  { id: 'contactPhone', label: 'WhatsApp', width: 140 },
  { id: 'tag', label: 'Plaquita', width: 160 },
  { id: 'personalization', label: 'Tamaño', width: 140 },
  { id: 'images', label: 'Imágenes', width: 100, align: 'center' },
  { id: 'status', label: 'Estado', width: 120, align: 'center' },
  { id: 'createdAt', label: 'Fecha', width: 140 },
  { id: 'actions', label: 'Acciones', align: 'center', width: 100 },
];

const FILTER_CONFIG: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Buscar',
    placeholder: 'Buscar por nombre, teléfono...',
  },
  {
    key: 'status',
    type: 'select',
    label: 'Estado',
    options: [
      { value: 'all', label: 'Todos' },
      { value: 'pending', label: 'Pendiente' },
      { value: 'in-progress', label: 'En proceso' },
      { value: 'completed', label: 'Completado' },
      { value: 'cancelled', label: 'Cancelado' },
    ],
  },
  { key: 'startDate', type: 'date', label: 'Desde' },
  { key: 'endDate', type: 'date', label: 'Hasta' },
];

export default function PetTagListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const settings = useSettingsContext();
  const confirm = useBoolean();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<IPetTagOrder | undefined>(
    undefined
  );
  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isError, error, refetch } =
    useGetAllPetTags(activeFilters);

  const tableData: IPetTagOrder[] = useMemo(
    () => data?.payload || [],
    [data?.payload]
  );

  const notFound = !tableData.length;

  const handleFiltersChange = useCallback(
    (newFilters: Partial<UserQueryParams>) => {
      setActiveFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      console.log('Deleting pet tag with id:', id);
      enqueueSnackbar('Pet tag eliminado');
      refetch();
    },
    [enqueueSnackbar, refetch]
  );

  const handleDeleteRows = useCallback(() => {
    enqueueSnackbar('Pet tags eliminados');
    confirm.onFalse();
    table.onSelectAllRows(false, []);
    refetch();
  }, [enqueueSnackbar, confirm, table, refetch]);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setActiveFilters((prev) => ({ ...prev, page: newPage + 1 }));
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setActiveFilters((prev) => ({
        ...prev,
        limit: parseInt(event.target.value, 10),
        page: 1,
      }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    setActiveFilters((prev) => ({ ...prev, page: 1 }));
    table.onResetPage();
  }, [table]);

  const handleClear = useCallback(() => {
    setActiveFilters({ page: 1, limit: activeFilters.limit || 10 });
    table.onResetPage();
  }, [activeFilters.limit, table]);

  const handleViewRow = useCallback((item: IPetTagOrder) => {
    setSelectedTag(item);
    setOpenModal(true);
  }, []);

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: string) => {
      enqueueSnackbar(`Estado actualizado a ${newStatus}`);
      refetch();
    },
    [enqueueSnackbar, refetch]
  );

  if (isError) {
    return (
      <EmptyContent
        filled
        title={`${error?.message}`}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Volver al Dashboard
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
          heading="Pet Tags"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Admin', href: paths.dashboard.admin.panelAdmin },
            { name: 'Pet Tags' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ my: 2 }}>
            <FilterToolbar
              filters={activeFilters}
              onFilters={handleFiltersChange}
              filterConfig={FILTER_CONFIG}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </Box>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Eliminar">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 900 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />
                <TableBody>
                  {tableData.map((row) => (
                    <PetTagTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onViewRow={() => handleViewRow(row)}
                      onUpdateStatusAction={handleUpdateStatus}
                      onRefetchAction={refetch}
                    />
                  ))}
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
              {isFetching && <LinearProgress color="secondary" />}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.pagination.total || 0}
            page={(activeFilters.page || 1) - 1}
            rowsPerPage={activeFilters.limit || 10}
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
        title="Eliminar"
        content={
          <>
            ¿Seguro que deseas eliminar <strong>{table.selected.length}</strong>{' '}
            pet tags?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Eliminar
          </Button>
        }
      />

      <PetTagQuickView
        open={openModal}
        petTag={selectedTag}
        onCloseAction={() => setOpenModal(false)}
        onRefetchAction={refetch}
        onUpdateStatusAction={handleUpdateStatus}
      />
    </>
  );
}
