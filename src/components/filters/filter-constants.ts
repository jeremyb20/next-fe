import { FilterConfig } from './filter-toolbar';

export const USER_STATUS_OPTIONS = [
  { value: '0', label: 'Active', color: 'success' },
  { value: '1', label: 'Pending', color: 'info' },
  { value: '2', label: 'Banned', color: 'error' },
  { value: '3', label: 'Not Verified', color: 'info' },
  { value: '4', label: 'Rejected', color: 'warning' },
];

export const USER_ROLE_OPTIONS = [
  { value: '0', label: 'Admin' },
  { value: '1', label: 'Veterinarian' },
  { value: '2', label: 'Groomer' },
  { value: '3', label: 'Client' },
  { value: '4', label: 'Guest' },
];

export const STATUS_QRCODE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'activated', label: 'Activated' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' },
];

export const MEDICAL_OPTIONS = [
  { value: 'vaccine', label: 'vaccine' },
  { value: 'deworming', label: 'Deworming' },
  { value: 'medical_visit', label: 'Medical Visit' },
];

// SEO Status Options
const SEO_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'draft', label: 'Draft' },
];

const CONTENT_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'page', label: 'Page' },
  { value: 'product', label: 'Product' },
  { value: 'article', label: 'Article' },
  { value: 'category', label: 'Category' },
  { value: 'landing', label: 'Landing Page' },
];

const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'ES', label: 'Spanish' },
  { value: 'EN', label: 'English' },
  { value: 'FR', label: 'French' },
  { value: 'DE', label: 'German' },
  { value: 'IT', label: 'Italian' },
  { value: 'PT', label: 'Portuguese' },
];

// En tu archivo filter-constants.ts
export const SEO_FILTER_TOOLBAR = [
  {
    key: 'pageId',
    type: 'text' as const,
    label: 'Page ID',
    placeholder: 'Search by Page ID...',
  },
  {
    key: 'status',
    type: 'select' as const,
    label: 'Status',
    options: SEO_STATUS_OPTIONS,
  },
  {
    key: 'contentType',
    type: 'select' as const,
    label: 'Content Type',
    options: CONTENT_TYPE_OPTIONS,
  },
  {
    key: 'language',
    type: 'select' as const,
    label: 'Language',
    options: LANGUAGE_OPTIONS,
  },
  {
    key: 'startDate',
    type: 'date' as const,
    label: 'Start Date',
  },
  {
    key: 'endDate',
    type: 'date' as const,
    label: 'End Date',
  },
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
    options: USER_STATUS_OPTIONS,
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

export const MEDICAL_RECORD_FILTER_TOOLBAR: FilterConfig[] = [
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
    options: MEDICAL_OPTIONS,
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
