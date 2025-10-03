import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Button, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from 'src/components/iconify';

interface FilterToolbarProps {
  filters: any;
  onFilters: (filters: any) => void;
  filterConfig: FilterConfig[];
  dateError?: boolean;
  onSearch: () => void;
  onClear: () => void;
}

export interface FilterConfig {
  key: string;
  type: 'text' | 'select' | 'date' | 'number';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  width?: number | string;
}

export default function FilterToolbar({
  filters,
  onFilters,
  filterConfig,
  dateError,
  onSearch,
  onClear,
}: FilterToolbarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleLocalFilterChange = useCallback((key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    onFilters(localFilters);
    onSearch();
  }, [localFilters, onFilters, onSearch]);

  const handleClear = useCallback(() => {
    const clearedFilters: any = {};
    filterConfig.forEach((config) => {
      clearedFilters[config.key] = '';
    });
    // Mantener paginación
    clearedFilters.page = filters.page || 1;
    clearedFilters.limit = filters.limit || 10;

    setLocalFilters(clearedFilters);
    onFilters(clearedFilters);
    onClear();
  }, [filterConfig, filters.page, filters.limit, onFilters, onClear]);

  // Verificar si hay filtros activos para habilitar el botón de limpiar
  const hasActiveFilters = useCallback(() => {
    const { ...activeFilters } = localFilters;
    return Object.values(activeFilters).some(
      (value) => value !== undefined && value !== null && value !== ''
    );
  }, [localFilters]);

  const renderFilterField = (config: FilterConfig) => {
    switch (config.type) {
      case 'text':
        return (
          <TextField
            key={config.key}
            fullWidth
            value={localFilters[config.key] || ''}
            onChange={(e) =>
              handleLocalFilterChange(config.key, e.target.value)
            }
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        );

      case 'date':
        return (
          <DatePicker
            key={config.key}
            label={config.label}
            value={localFilters[config.key] || null}
            onChange={(newValue) =>
              handleLocalFilterChange(config.key, newValue)
            }
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
            value={localFilters[config.key] || ''}
            onChange={(e) =>
              handleLocalFilterChange(config.key, e.target.value)
            }
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

      {/* Botones de acción */}
      <Stack direction="row" spacing={1} sx={{ minWidth: 200 }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<Iconify icon="eva:search-fill" />}
          sx={{ flex: 1 }}
        >
          Buscar
        </Button>

        <Button
          variant="outlined"
          onClick={handleClear}
          disabled={!hasActiveFilters()}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
          sx={{ flex: 1 }}
        >
          Limpiar
        </Button>
      </Stack>
    </Stack>
  );
}
