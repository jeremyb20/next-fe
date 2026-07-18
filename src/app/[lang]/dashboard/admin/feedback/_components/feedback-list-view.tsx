// sections/feedback/view/feedback-list-view.tsx
'use client';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { useMemo, useState, useCallback } from 'react';
import TableContainer from '@mui/material/TableContainer';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { IFeedback } from '@/types/feedback';
import Scrollbar from '@/components/scrollbar';
import { RouterLink } from '@/routes/components';
import { useBoolean } from '@/hooks/use-boolean';
import { useSnackbar } from '@/components/snackbar';
import EmptyContent from '@/components/empty-content';
import { isAfter, isBetween } from '@/utils/format-time';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import FilterToolbar, {
  FilterConfig,
} from '@/components/filters/filter-toolbar';
import {
  useGetAllFeedback,
  UserQueryParams,
} from '@/hooks/use-fetch-paginated';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '@/components/table';

import FeedbackTableRow from './feedback-table-row';
import FeedbackQuickView from './feedback-quick-view';

export interface IFeedbackTableFilters {
  search: string;
  type: string;
  status: string;
  priority: string;
  rating: string;
  category: string;
  startDate: Date | null;
  endDate: Date | null;
}

const TABLE_HEAD = [
  { id: 'type', label: 'Type', width: 120 },
  { id: 'title', label: 'Title/Description' },
  { id: 'rating', label: 'Rating', width: 100, align: 'center' },
  { id: 'user', label: 'User', width: 150 },
  { id: 'priority', label: 'Priority', width: 100, align: 'center' },
  { id: 'status', label: 'Status', width: 120, align: 'center' },
  { id: 'createdAt', label: 'Date', width: 140 },
  { id: 'actions', label: 'Actions', align: 'center', width: 100 },
];

export const FEEDBACK_FILTER_TOOLBAR: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search by title, description, user...',
  },
  {
    key: 'type',
    type: 'select',
    label: 'Type',
    options: [
      { value: 'all', label: 'All Types' },
      { value: 'general_feedback', label: 'General Feedback' },
      { value: 'improvement', label: 'Improvement' },
      { value: 'bug', label: 'Bug' },
      { value: 'suggestion', label: 'Suggestion' },
      { value: 'question', label: 'Question' },
    ],
  },
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'reviewing', label: 'Reviewing' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
  {
    key: 'priority',
    type: 'select',
    label: 'Priority',
    options: [
      { value: 'all', label: 'All Priority' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ],
  },
  {
    key: 'rating',
    type: 'select',
    label: 'Rating',
    options: [
      { value: 'all', label: 'All Ratings' },
      { value: '1', label: '⭐ 1' },
      { value: '2', label: '⭐ 2' },
      { value: '3', label: '⭐ 3' },
      { value: '4', label: '⭐ 4' },
      { value: '5', label: '⭐ 5' },
    ],
  },
  {
    key: 'startDate',
    type: 'date',
    label: 'Start Date',
  },
  {
    key: 'endDate',
    type: 'date',
    label: 'End Date',
  },
];

const defaultFilters: IFeedbackTableFilters = {
  search: '',
  type: 'all',
  status: 'all',
  priority: 'all',
  rating: 'all',
  category: 'all',
  startDate: null,
  endDate: null,
};

// Mapeo de tipos para mostrar
const TYPE_LABELS: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  general_feedback: {
    label: 'General',
    color: 'primary',
    icon: 'mdi:star-outline',
  },
  improvement: {
    label: 'Improvement',
    color: 'info',
    icon: 'mdi:lightbulb-outline',
  },
  bug: { label: 'Bug', color: 'error', icon: 'mdi:bug-outline' },
  suggestion: {
    label: 'Suggestion',
    color: 'warning',
    icon: 'mdi:comment-outline',
  },
  question: {
    label: 'Question',
    color: 'secondary',
    icon: 'mdi:help-circle-outline',
  },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  reviewing: { label: 'Reviewing', color: 'info' },
  'in-progress': { label: 'In Progress', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'info' },
  medium: { label: 'Medium', color: 'warning' },
  high: { label: 'High', color: 'error' },
  critical: { label: 'Critical', color: 'error' },
};

// ----------------------------------------------------------------------

export default function FeedbackListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const settings = useSettingsContext();
  const confirm = useBoolean();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<
    IFeedback | undefined
  >(undefined);

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
    data: feedbackData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllFeedback(activeFilters);

  const tableData: IFeedback[] = useMemo(
    () => feedbackData?.payload || [],
    [feedbackData?.payload]
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
    !!filters.search ||
    filters.type !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.rating !== 'all' ||
    filters.category !== 'all' ||
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
      console.log('Deleting feedback with id:', id);
      enqueueSnackbar('Feedback deleted successfully!');
      refetch();
    },
    [enqueueSnackbar, refetch]
  );

  const handleDeleteRows = useCallback(() => {
    // Aquí iría la llamada a la API para eliminar múltiples
    enqueueSnackbar('Feedback entries deleted successfully!');
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

  const handleViewRow = useCallback((item: IFeedback) => {
    setSelectedFeedback(item);
    setOpenModal(true);
  }, []);

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: string) => {
      console.log('Updating feedback status:', id, newStatus);
      enqueueSnackbar(`Status updated to ${newStatus}`);
      refetch();
    },
    [enqueueSnackbar, refetch]
  );

  const getRatingDisplay = (rating?: number) => {
    if (!rating) return '-';
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Iconify icon="mdi:star" width={16} sx={{ color: 'warning.main' }} />
        <Typography variant="body2">{rating}/5</Typography>
      </Stack>
    );
  };

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
            Back to Dashboard
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
          heading="Feedback Management"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Feedback',
              href: paths.dashboard.admin.feedback,
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
              filterConfig={FEEDBACK_FILTER_TOOLBAR}
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
                    <FeedbackTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id!)}
                      onSelectRow={() => table.onSelectRow(row._id!)}
                      onDeleteRow={() => handleDeleteRow(row._id!)}
                      onViewRow={() => handleViewRow(row)}
                      updateStatusAction={handleUpdateStatus}
                      refetchAction={refetch}
                      getRatingDisplayAction={getRatingDisplay}
                      typeLabels={TYPE_LABELS}
                      statusLabels={STATUS_LABELS}
                      priorityLabels={PRIORITY_LABELS}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
              {isFetching ? <LinearProgress color="secondary" /> : null}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={feedbackData?.pagination.total || 0}
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
            <strong> {table.selected.length} </strong> feedback entries?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />

      <FeedbackQuickView
        open={openModal}
        feedback={selectedFeedback}
        onCloseAction={() => setOpenModal(false)}
        onRefetchAction={refetch}
        onUpdateStatusAction={handleUpdateStatus}
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
  inputData: IFeedback[];
  filters: IFeedbackTableFilters;
  dateError: boolean;
}) {
  const {
    search,
    type,
    status,
    priority,
    rating,
    category,
    startDate,
    endDate,
  } = filters;

  if (
    !search &&
    type === 'all' &&
    status === 'all' &&
    priority === 'all' &&
    rating === 'all' &&
    category === 'all' &&
    !startDate &&
    !endDate
  ) {
    return inputData;
  }

  let filteredData = [...inputData];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.reason?.toLowerCase().includes(searchLower) ||
        item.comments?.toLowerCase().includes(searchLower) ||
        item.user?.email?.toLowerCase().includes(searchLower) ||
        item.user?.name?.toLowerCase().includes(searchLower)
    );
  }

  if (type !== 'all') {
    filteredData = filteredData.filter((item) => item.type === type);
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  if (priority !== 'all') {
    filteredData = filteredData.filter((item) => item.priority === priority);
  }

  if (rating !== 'all') {
    const ratingNum = Number(rating);
    filteredData = filteredData.filter((item) => item.rating === ratingNum);
  }

  if (category !== 'all') {
    filteredData = filteredData.filter((item) => item.category === category);
  }

  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((item) =>
        isBetween(new Date(item.createdAt), startDate, endDate)
      );
    }
  }

  return filteredData;
}
