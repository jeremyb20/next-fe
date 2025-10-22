import { FilterConfig } from './filter-toolbar';

export const STATUS_OPTIONS = [
  { value: '2', label: 'Verified' },
  { value: '3', label: 'Not verified' },
  { value: '1', label: 'Inactive' },
];

export const STATUS_QRCODE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'activated', label: 'Activated' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' },
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

export const PET_FILTER_TOOLBAR: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search by Name...',
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

export const ADMIN_QRCODE_FILTER_TOOLBAR: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search by random code...',
    width: '100%',
  },
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: STATUS_QRCODE_OPTIONS,
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
