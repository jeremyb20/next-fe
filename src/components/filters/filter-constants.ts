import { FilterConfig } from './filter-toolbar';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'banned', label: 'Banned' },
];

export const ADMIN_USER_FILTER_TOOLBAR: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search by email...',
    width: 300,
  },
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: STATUS_OPTIONS,
    width: 200,
  },
  {
    key: 'startDate',
    type: 'date',
    label: 'Start Date',
    width: 200,
  },
  {
    key: 'endDate',
    type: 'date',
    label: 'End Date',
    width: 200,
  },
];
