/* eslint-disable no-nested-ternary */

'use client';

import { paths } from '@/routes/paths';
import { IPromotions } from '@/types/api';
import { useRouter } from '@/routes/hooks';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { useSnackbar } from '@/components/snackbar';
import EmptyContent from '@/components/empty-content';
import { useMemo, useState, useCallback } from 'react';
import { isAfter, isBetween } from '@/utils/format-time';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import FilterToolbar from '@/components/filters/filter-toolbar';
import { ADMIN_QRCODE_FILTER_TOOLBAR } from '@/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetAllPromotionsList,
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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import {
  Box,
  Paper,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@mui/material';

import PromotionTableRow from '../promotion-table-row';
import PromotionEditForm from '../promotion-edit-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Promo Name' },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'updatedAt', label: 'Updated', width: 140 },
  { id: 'discount', label: 'Discount', align: 'center' },
  {
    id: 'code',
    label: 'Code',
    align: 'center',
  },
  { id: 'validUntil', label: 'Valid Until', width: 140 },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: '', label: '', align: 'right' },
];

export interface IPromotionsTableFilters {
  title: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

const defaultFilters: IPromotionsTableFilters = {
  title: '',
  status: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function PromotionsListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt' });
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const theme = useTheme();

  // Estado para filtros de API (paginación)
  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 5,
  });

  // Estado para filtros de UI (filtrado local)
  const [uiFilters, setUiFilters] =
    useState<IPromotionsTableFilters>(defaultFilters);

  const [editPromotions, setPromotionsList] = useState(false);
  const [promotionItem, setPromotionItem] = useState<IPromotions>();

  // Validación de fechas
  const dateError = useMemo(() => {
    const { startDate } = uiFilters;
    const { endDate } = uiFilters;
    if (startDate && endDate) {
      return isAfter(startDate, endDate);
    }
    return false;
  }, [uiFilters]);

  const {
    data: promotionsData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllPromotionsList(activeFilters);

  const tableData: IPromotions[] = useMemo(
    () => promotionsData?.payload || [],
    [promotionsData?.payload]
  );

  // Aplicar filtros locales a los datos
  const dataFiltered = useMemo(() => {
    let filteredData = [...tableData];

    // Filtro por título
    if (uiFilters.title) {
      filteredData = filteredData.filter((promo) =>
        promo.title.toLowerCase().includes(uiFilters.title.toLowerCase())
      );
    }

    // Filtro por estado
    if (uiFilters.status && uiFilters.status !== 'all') {
      filteredData = filteredData.filter(
        (promo) => promo.status === uiFilters.status
      );
    }

    // Filtro por rango de fechas
    if (!dateError && uiFilters.startDate && uiFilters.endDate) {
      filteredData = filteredData.filter((promo) => {
        const createdAt = new Date(promo.createdAt);
        return isBetween(createdAt, uiFilters.startDate!, uiFilters.endDate!);
      });
    }

    // Aplicar ordenamiento de la tabla
    if (table.orderBy) {
      const comparator = getComparator(
        table.order,
        table.orderBy
      ) as unknown as (a: IPromotions, b: IPromotions) => number;
      filteredData = filteredData.sort(comparator);
    }

    return filteredData;
  }, [tableData, uiFilters, dateError, table.order, table.orderBy]);

  // Verificar si hay filtros activos
  const hasFilters = useMemo(
    () =>
      !!uiFilters.title ||
      (uiFilters.status && uiFilters.status !== 'all') ||
      !!uiFilters.startDate ||
      !!uiFilters.endDate,
    [uiFilters]
  );

  const notFound = !tableData.length || (!dataFiltered.length && hasFilters);

  // Manejador de cambios en filtros
  const handleFiltersChange = useCallback(
    (newFilters: Partial<UserQueryParams>) => {
      // Actualizar filtros UI
      if (newFilters.title !== undefined) {
        setUiFilters((prev) => ({ ...prev, title: newFilters.title || '' }));
      }
      if (newFilters.status !== undefined) {
        setUiFilters((prev) => ({ ...prev, status: newFilters.status || '' }));
      }
      if (newFilters.startDate !== undefined) {
        setUiFilters((prev) => ({
          ...prev,
          startDate: newFilters.startDate
            ? new Date(newFilters.startDate)
            : null,
        }));
      }
      if (newFilters.endDate !== undefined) {
        setUiFilters((prev) => ({
          ...prev,
          endDate: newFilters.endDate ? new Date(newFilters.endDate) : null,
        }));
      }
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

  const handleEditRow = useCallback((promotion: IPromotions) => {
    setPromotionsList(true);
    setPromotionItem(promotion);
  }, []);

  const handleCreatePromotion = useCallback(() => {
    setPromotionsList(true);
    setPromotionItem(undefined);
  }, []);

  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setActiveFilters((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  }, []);

  const refetchAll = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setActiveFilters((prev) => ({
        ...prev,
        limit: newRowsPerPage,
        page: 1,
      }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    // Resetear página cuando se busca
    setActiveFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    table.onResetPage();
    enqueueSnackbar('Search completed', { variant: 'success' });
  }, [table, enqueueSnackbar]);

  const handleClear = useCallback(() => {
    // Limpiar todos los filtros UI
    setUiFilters(defaultFilters);
    // Resetear página
    setActiveFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    table.onResetPage();
    enqueueSnackbar('Filters cleared', { variant: 'info' });
  }, [table, enqueueSnackbar]);

  if (isError) {
    return (
      <EmptyContent
        filled
        title={`${error?.message || 'Error loading promotions'}`}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.admin.promotions}
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
          heading="Promotions List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Promotion',
              href: paths.dashboard.admin.promotions,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Button
              onClick={handleCreatePromotion}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create Promotion
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Box sx={{ my: 2 }}>
            <FilterToolbar
              filters={{
                title: uiFilters.title,
                status: uiFilters.status,
                startDate: uiFilters.startDate,
                endDate: uiFilters.endDate,
              }}
              onFilters={handleFiltersChange}
              filterConfig={ADMIN_QRCODE_FILTER_TOOLBAR}
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
                  dataFiltered.map((row) => row._id)
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
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />
                <TableBody>
                  {/* IMPORTANTE: Usar dataFiltered, NO tableData */}
                  {dataFiltered.map((row) => (
                    <PromotionTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row)}
                      refetchAll={() => {
                        refetchAll();
                        setPromotionsList(false);
                      }}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
              {isFetching && <LinearProgress color="secondary" />}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={promotionsData?.pagination?.total || 0}
            page={(activeFilters.page || 1) - 1}
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
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <Dialog open={editPromotions} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            component={Paper}
            sx={{ width: '100%' }}
          >
            <Typography variant="h6">
              {promotionItem ? 'Edit Promotion' : 'New Promotion'}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setPromotionsList(false)}
              sx={{
                color: theme.palette.grey[500],
              }}
            >
              <Iconify width={24} icon="solar:close-circle-linear" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <PromotionEditForm
            currentPromotion={promotionItem}
            close={setPromotionsList}
            refetchAll={refetchAll}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
