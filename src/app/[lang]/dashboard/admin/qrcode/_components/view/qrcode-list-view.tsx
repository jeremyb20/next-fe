/* eslint-disable no-nested-ternary */

'use client';

import sumBy from 'lodash/sumBy';
import { useMemo, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

// import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import { IQrCode } from '@/src/types/api';
import { useGetQRStats } from '@/src/hooks/use-fetch';
import EmptyContent from '@/src/components/empty-content';
import FilterToolbar from '@/src/components/filters/filter-toolbar';
import { ADMIN_QRCODE_FILTER_TOOLBAR } from '@/src/components/filters/filter-constants';
import {
  UserQueryParams,
  useGetAllQrCodeList,
} from '@/src/hooks/use-fetch-paginated';

import {
  Box,
  Paper,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import QrCodeAnalytic from '../qrcode-analytic';
import QrCodeTableRow from '../qrcode-table-row';
import QrCodeEditForm from '../qrcode-edit-form';
// import InvoiceTableToolbar from '../invoice-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'assignedTo', label: 'User Asigned' },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'updatedAt', label: 'Updated', width: 140 },
  { id: 'randomCode', label: 'Random Code', align: 'center' },
  { id: 'hostName', label: 'Host Name', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: '', label: '', align: 'right' },
];

export interface IQRcodeTableFilters {
  randomCode: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

const defaultFilters: IQRcodeTableFilters = {
  randomCode: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function QrCodeListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt' });
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const theme = useTheme();

  // SOLUCIÓN: Unificar en un solo estado para filtros y paginación
  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 5,
    status: 'all',
  });
  const [editQrCode, setEditQrCode] = useState(false);
  const [qrCodeItem, setQrCodeItem] = useState<IQrCode>();

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
    data: qrCodeData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllQrCodeList(activeFilters);

  const {
    data: qrCodeStats,
    isFetching: isFetchingStats,
    isError: isErrorStats,
    error: errorStats,
    refetch: refetchStats,
  } = useGetQRStats();

  const tableData: IQrCode[] = useMemo(
    () => qrCodeData?.payload || [],
    [qrCodeData?.payload]
  );

  const qrCodeStatsData: any = useMemo(() => qrCodeStats || [], [qrCodeStats]);

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: qrCodeStatsData.totalCodes,
    },

    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count:
        qrCodeStatsData.byStatus?.find((item: any) => item.status === 'pending')
          ?.count || 0,
    },
    {
      value: 'assigned',
      label: 'Assigned',
      color: 'info',
      count:
        qrCodeStatsData.byStatus?.find(
          (item: any) => item.status === 'assigned'
        )?.count || 0,
    },
    {
      value: 'activated',
      label: 'Activated',
      color: 'primary',
      count:
        qrCodeStatsData.byStatus?.find(
          (item: any) => item.status === 'activated'
        )?.count || 0,
    },
    {
      value: 'available',
      label: 'Available',
      color: 'success',
      count:
        qrCodeStatsData.byStatus?.find(
          (item: any) => item.status === 'available'
        )?.count || 0,
    },
  ] as const;

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
        a: IQrCode,
        b: IQrCode
      ) => number;
      filteredData = filteredData.sort(comparator);
    }

    return filteredData;
  }, [tableData, table.order, table.orderBy, filters, dateError]);

  const canReset =
    !!filters.randomCode ||
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

  const handleEditRow = useCallback((qrcode: IQrCode) => {
    setEditQrCode(true);
    setQrCodeItem(qrcode);
  }, []);

  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setActiveFilters((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  }, []);

  const refetchAll = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetch, refetchStats]);

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

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFiltersChange({ status: newValue });
    },
    [handleFiltersChange]
  );

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
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Qr Code',
              href: paths.dashboard.invoice.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Generate QR codes
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {isFetchingStats && <LinearProgress />}
          {isErrorStats ? (
            <EmptyContent
              filled
              title={`${errorStats?.message || 'Someting went wrong'}`}
              sx={{ py: 10 }}
            />
          ) : (
            <Scrollbar>
              <Stack
                direction="row"
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderStyle: 'dashed' }}
                  />
                }
                sx={{ py: 2 }}
              >
                <QrCodeAnalytic
                  title="Total"
                  total={qrCodeStatsData.totalCodes}
                  percent={100}
                  price={sumBy(tableData, 'totalAmount')}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.info.main}
                />

                {qrCodeStatsData?.byStatus?.map((item: any) => (
                  <QrCodeAnalytic
                    key={item.status}
                    title={item.status}
                    total={item.count || 0}
                    percent={item.percentage}
                    price={item.totalAmount}
                    icon={
                      item.status === 'pending'
                        ? 'solar:sort-by-time-bold-duotone'
                        : item.status === 'available'
                          ? 'solar:bell-bing-bold-duotone'
                          : item.status === 'assigned'
                            ? 'carbon:intent-request-active'
                            : 'solar:chat-round-check-outline'
                    }
                    color={
                      item.status === 'pending'
                        ? theme.palette.warning.main
                        : item.status === 'available'
                          ? theme.palette.error.main
                          : item.status === 'assigned'
                            ? theme.palette.success.main
                            : theme.palette.info.main
                    }
                  />
                ))}
              </Stack>
            </Scrollbar>
          )}
        </Card>

        <Card>
          <Tabs
            value={activeFilters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(
                theme.palette.grey[500],
                0.08
              )}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) &&
                        'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <Box sx={{ my: 2 }}>
            <FilterToolbar
              filters={activeFilters}
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
                  {dataFiltered.map((row) => (
                    <QrCodeTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row)}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
              {isFetching ? <LinearProgress color="secondary" /> : null}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={qrCodeData?.pagination.total || 0}
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

      <Dialog open={editQrCode} maxWidth="md">
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            component={Paper}
            sx={{ width: '100%' }}
          >
            <Typography variant="h6">Edit QR Code</Typography>

            <IconButton
              aria-label="close"
              onClick={() => setEditQrCode(false)}
              sx={{
                color: theme.palette.grey[500],
              }}
            >
              <Iconify width={30} icon="solar:close-circle-linear" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <QrCodeEditForm
            currentQrCode={qrCodeItem}
            close={setEditQrCode}
            refetchAll={refetchAll}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: IQrCode[];
  filters: IQRcodeTableFilters;
  dateError: boolean;
}) {
  const { status, randomCode, startDate, endDate } = filters;

  // Si no hay filtros aplicados, devolver los datos tal cual
  if (!randomCode && status === 'all' && !startDate && !endDate) {
    return inputData;
  }

  let filteredData = [...inputData];

  if (randomCode) {
    filteredData = filteredData.filter((qrcode) =>
      qrcode.randomCode.toLowerCase().includes(randomCode.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((qrcode) => qrcode.status === status);
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
