'use client';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import { IProductItem } from '@/types/product';
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
import { PET_FILTER_TOOLBAR } from '@/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetAllProductList,
} from '@/hooks/use-fetch-paginated';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '@/components/table';

import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import ProductTableRow from './product-shop-table-row';

export interface IProductTableFilters {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

export type IProductTableFilterValue = string | Date | null;

const TABLE_HEAD = [
  { id: 'name', label: 'Product', width: 300 },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'inventoryType', label: 'Stock', width: 140 },
  { id: 'price', label: 'Price', width: 120 },
  { id: 'publish', label: 'Published', width: 120 },
  { id: '', width: 88 },
];

const defaultFilters: IProductTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt' });
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

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
    data: ProductData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllProductList(activeFilters);

  const tableData: IProductItem[] = useMemo(
    () => ProductData?.payload || [],
    [ProductData?.payload]
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

  const handleEditRow = useCallback(
    (productId: string) => {
      router.push(paths.dashboard.admin.product.edit(productId));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (productId: string) => {
      router.push(paths.dashboard.admin.product.details(productId));
    },
    [router]
  );

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
    refetch();
  }, [activeFilters.limit, table, enqueueSnackbar, refetch]);

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
          heading="List"
          links={[
            { name: 'Inicio', href: paths.dashboard.root },
            {
              name: 'Product',
              href: paths.dashboard.product.root,
            },
            { name: 'List' },
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <Button
                component={RouterLink}
                href={paths.dashboard.admin.product.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Product
              </Button>
              <Button
                variant="outlined"
                onClick={() => refetch()}
                startIcon={<Iconify icon="solar:refresh-bold" />}
              >
                Refresh
              </Button>
            </Stack>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card>
          <Stack sx={{ my: 2 }}>
            <FilterToolbar
              filters={activeFilters}
              onFilters={handleFiltersChange}
              filterConfig={PET_FILTER_TOOLBAR}
              dateError={dateError}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.productId)
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
                      dataFiltered.map((row) => row.productId)
                    )
                  }
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <ProductTableRow
                      key={row.productId}
                      row={row}
                      selected={table.selected.includes(row.productId)}
                      onSelectRow={() => table.onSelectRow(row.productId)}
                      onDeleteRow={() => handleDeleteRow(row.productId)}
                      onViewRow={() => handleViewRow(row.productId)}
                      onEditRow={() => handleEditRow(row.productId)}
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
            count={ProductData?.pagination?.total || 0}
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
            <strong> {table.selected.length} </strong> products?
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
  inputData: IProductItem[];
  filters: IProductTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

  // Si no hay filtros aplicados, devolver los datos tal cual
  if (!name && status === 'all' && !startDate && !endDate) {
    return inputData;
  }

  let filteredData = [...inputData];

  if (name) {
    filteredData = filteredData.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // if (status !== 'all') {
  //   filteredData = filteredData.filter(
  //     (product) => product..toString() === status
  //   );
  // }

  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((product) =>
        isBetween(new Date(product.createdAt), startDate, endDate)
      );
    }
  }

  return filteredData;
}
