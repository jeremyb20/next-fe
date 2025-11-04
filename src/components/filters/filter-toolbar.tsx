import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Button,
  Switch,
  Popover,
  MenuItem,
  FormGroup,
  Typography,
  IconButton,
  FormControlLabel,
} from '@mui/material';

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
  visible?: boolean;
}

interface FilterVisibility {
  [key: string]: boolean;
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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterVisibility, setFilterVisibility] = useState<FilterVisibility>(
    () => {
      const initialVisibility: FilterVisibility = {};
      filterConfig.forEach((config) => {
        initialVisibility[config.key] = config.visible === true;
      });
      return initialVisibility;
    }
  );

  const handleFilterButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleVisibilityChange = (key: string, visible: boolean) => {
    setFilterVisibility((prev) => ({
      ...prev,
      [key]: visible,
    }));
  };

  const handleLocalFilterChange = useCallback((key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    onFilters(localFilters);
    onSearch();
    handlePopoverClose();
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

  // Verificar si hay filtros visibles
  const hasVisibleFilters = Object.values(filterVisibility).some(
    (visible) => visible
  );

  const renderFilterField = (config: FilterConfig) => {
    if (!filterVisibility[config.key]) return null;

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

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <>
      {/* Popover de configuración de filtros */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 280,
            borderRadius: 1,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mostrar Filtros
        </Typography>

        <FormGroup>
          {filterConfig.map((config) => (
            <Box key={config.key} sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filterVisibility[config.key]}
                    onChange={(
                      _event: React.SyntheticEvent<Element, Event>,
                      checked: boolean
                    ) => handleVisibilityChange(config.key, checked)}
                    color="primary"
                  />
                }
                label={config.label}
                labelPlacement="start"
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  mx: 0,
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                  },
                }}
              />
            </Box>
          ))}
        </FormGroup>

        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button fullWidth variant="outlined" onClick={handlePopoverClose}>
            Cerrar
          </Button>
        </Box>
      </Popover>

      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ px: 2 }}
      >
        {/* Botón de configuración de filtros */}
        <IconButton
          onClick={handleFilterButtonClick}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            width: 48,
            height: 48,
          }}
        >
          <Iconify icon="eva:options-2-outline" />
        </IconButton>

        {/* Filtros visibles */}
        {hasVisibleFilters
          ? filterConfig.map(renderFilterField)
          : // <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            //   No hay filtros visibles. Use el botón de filtros para mostrar
            //   algunos.
            // </Typography>
            null}

        {/* Botones de acción */}
        {hasVisibleFilters && (
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              startIcon={<Iconify icon="eva:search-fill" />}
              sx={{ flex: 1 }}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClear}
              disabled={!hasActiveFilters()}
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              sx={{ flex: 1 }}
            >
              Limpiar
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                const clearedVisibility: FilterVisibility = {};
                filterConfig.forEach((config) => {
                  clearedVisibility[config.key] = false;
                });
                setFilterVisibility(clearedVisibility);
              }}
              startIcon={<Iconify icon="eva:close-circle-outline" />}
              sx={{ flex: 1 }}
            >
              Close All
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
}
