import { FilterConfig } from './filter-toolbar';

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: '0', label: 'Admin' },
  { value: '1', label: 'Groomer' },
  { value: '2', label: 'Veterinarian' },
  { value: '3', label: 'Client' },
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export const ADMIN_USER_FILTER_TOOLBAR: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search by email...',
    width: '100%',
  },
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: STATUS_OPTIONS,
    width: '100%',
  },
  {
    key: 'startDate',
    type: 'date',
    label: 'Start Date',
    width: '100%',
  },
  {
    key: 'endDate',
    type: 'date',
    label: 'End Date',
    width: '100%',
  },
];
