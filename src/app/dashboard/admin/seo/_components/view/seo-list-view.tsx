'use client';

import { ISeo } from '@/src/types/api';
import { useMemo, useState, useCallback } from 'react';
import EmptyContent from '@/src/components/empty-content';
import FilterToolbar from '@/src/components/filters/filter-toolbar';
import { SEO_FILTER_TOOLBAR } from '@/src/components/filters/filter-constants';
import { useGetAllSeo, UserQueryParams } from '@/src/hooks/use-fetch-paginated';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

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

import SeoTableRow from '../seo-table-row';
import SeoQuickEditForm from '../seo-quick-edit-form';

export interface ISeoTableFilters {
  pageId: string;
  status: string;
  contentType: string;
  language: string;
  startDate: Date | null;
  endDate: Date | null;
}

export type ISeoTableFilterValue = string | Date | null;

const TABLE_HEAD = [
  { id: 'pageId', label: 'Page ID' },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'updatedAt', label: 'Updated', width: 140 },
  { id: 'contentType', label: 'Content Type' },
  { id: 'status', label: 'Status' },
  { id: 'languages', label: 'Languages' },
  { id: 'priority', label: 'Priority', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

const defaultFilters: ISeoTableFilters = {
  pageId: '',
  status: 'all',
  contentType: 'all',
  language: 'all',
  startDate: null,
  endDate: null,
};

// Opciones para filtros

// ----------------------------------------------------------------------

export default function SeoListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt' });
  const settings = useSettingsContext();
  const confirm = useBoolean();

  const [openModal, setOpenModal] = useState(false);
  const [seoItem, setSeoItem] = useState<ISeo | undefined>(undefined);

  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 10,
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
    data: seoData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllSeo(activeFilters);

  const tableData: ISeo[] = useMemo(
    () => seoData?.payload || [],
    [seoData?.payload]
  );

  const [filters] = useState(defaultFilters);

  // Apply client-side filtering and sorting
  const dataFiltered = useMemo(() => {
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
    !!filters.pageId ||
    filters.status !== 'all' ||
    filters.contentType !== 'all' ||
    filters.language !== 'all' ||
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
      // Aquí iría la llamada a la API para eliminar
      enqueueSnackbar('SEO deleted successfully!');
      refetch();
    },
    [enqueueSnackbar, refetch]
  );

  const handleDeleteRows = useCallback(() => {
    // Aquí iría la llamada a la API para eliminar múltiples
    enqueueSnackbar('SEO entries deleted successfully!');
    confirm.onFalse();
    table.onSelectAllRows(false, []);
    refetch();
  }, [enqueueSnackbar, confirm, table, refetch]);

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
        page: 1,
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
    enqueueSnackbar('Search completed', { variant: 'success' });
  }, [table, enqueueSnackbar]);

  const handleClear = useCallback(() => {
    const clearedFilters = {
      page: 1,
      limit: activeFilters.limit || 10,
    };

    setActiveFilters(clearedFilters);
    table.onResetPage();
    enqueueSnackbar('Filters cleared', { variant: 'info' });
  }, [activeFilters.limit, table, enqueueSnackbar]);

  const handleEditRow = useCallback((item: ISeo) => {
    setSeoItem(item);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      //   router.push(paths.dashboard.seo.details(id));
    },
    // [router]
    []
  );

  const handleCreateNew = useCallback(
    () => {
      // router.push(paths.dashboard.seo.create);
      setSeoItem(undefined);
      setOpenModal(true);
    },
    //   [router]
    []
  );

  if (isError) {
    return (
      <EmptyContent
        filled
        title={`${error?.message}`}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.admin.seoAdmin}
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
          heading="SEO Management"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'SEO',
              href: paths.dashboard.admin.seoAdmin,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={handleCreateNew}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New SEO
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <FilterToolbar
            filters={activeFilters}
            onFilters={handleFiltersChange}
            filterConfig={SEO_FILTER_TOOLBAR}
            dateError={dateError}
            onSearch={handleSearch}
            onClear={handleClear}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id!)
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
                      dataFiltered.map((row) => row._id!)
                    )
                  }
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <SeoTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id!)}
                      onSelectRow={() => table.onSelectRow(row._id!)}
                      onDeleteRow={() => handleDeleteRow(row._id!)}
                      onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row._id!)}
                      refetch={refetch}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
              {isFetching ? <LinearProgress color="secondary" /> : null}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={seoData?.pagination.total || 0}
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
        title="Delete"
        content={
          <>
            Are you sure want to delete{' '}
            <strong> {table.selected.length} </strong> SEO entries?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />

      <SeoQuickEditForm
        open={openModal}
        currentSeo={seoItem}
        onClose={() => setOpenModal(false)}
        refetch={refetch}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: ISeo[];
  filters: ISeoTableFilters;
  dateError: boolean;
}) {
  const { pageId, status, contentType, language, startDate, endDate } = filters;

  if (
    !pageId &&
    status === 'all' &&
    contentType === 'all' &&
    language === 'all' &&
    !startDate &&
    !endDate
  ) {
    return inputData;
  }

  let filteredData = [...inputData];

  if (pageId) {
    filteredData = filteredData.filter((seo) =>
      seo.pageId.toLowerCase().includes(pageId.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((seo) => seo.status === status);
  }

  if (contentType !== 'all') {
    filteredData = filteredData.filter(
      (seo) => seo.contentType === contentType
    );
  }

  if (language !== 'all') {
    filteredData = filteredData.filter((seo) =>
      seo.multiLanguageContent.some((content) => content.language === language)
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((seo) =>
        isBetween(new Date(seo.lastModified), startDate, endDate)
      );
    }
  }

  return filteredData;
}
