import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from 'src/components/iconify';

interface FilterToolbarProps {
  filters: any;
  onFilters: (filters: any) => void;
  filterConfig: FilterConfig[];
  dateError?: boolean;
}

export interface FilterConfig {
  key: string;
  type: 'text' | 'select' | 'date' | 'number';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  width?: number;
}

export default function FilterToolbar({
  filters,
  onFilters,
  filterConfig,
  dateError,
}: FilterToolbarProps) {
  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      onFilters({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFilters]
  );

  const renderFilterField = (config: FilterConfig) => {
    switch (config.type) {
      case 'text':
        return (
          <TextField
            key={config.key}
            fullWidth
            value={filters[config.key] || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value)}
            placeholder={config.placeholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: config.width }}
          />
        );

      case 'date':
        return (
          <DatePicker
            key={config.key}
            label={config.label}
            value={filters[config.key] || null}
            onChange={(newValue) => handleFilterChange(config.key, newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: dateError && config.key === 'endDate',
              },
            }}
            sx={{ maxWidth: config.width }}
          />
        );

      case 'select':
        return (
          <TextField
            key={config.key}
            select
            fullWidth
            label={config.label}
            value={filters[config.key] || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value)}
            sx={{ maxWidth: config.width }}
          >
            {config.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );

      default:
        return null;
    }
  };

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      {filterConfig.map(renderFilterField)}
    </Stack>
  );
}
