// src/components/catalog/steps/StepPersonalize.tsx
'use client';
import React, { useState } from 'react';
import { MuiColorInput, MuiColorInputValue } from 'mui-color-input';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  FormHelperText,
} from '@mui/material';

import Iconify from '@/components/iconify'; // Ajusta la ruta según tu proyecto

import TagPreview from '../TagPreview';
import {
  TagOption,
  PersonalizationData,
  TagFilters,
} from '../../../types/pet-tag.types';

interface StepPersonalizeProps {
  filters: TagFilters;

  tag: TagOption | null;
  personalization: PersonalizationData;
  onPersonalizationChange: (data: PersonalizationData) => void;
  onComplete: () => void;
  onBack: () => void;
}

const fontOptions = [
  'Comic Sans MS',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Impact',
  'Verdana',
  'Courier New',
  'Trebuchet MS',
];

const iconOptions = ['🐾', '🐶', '🐱', '❤️', '⭐', '🎾', '🏠', '🌈'];

const strokePositionOptions = [
  { value: 'inside', label: 'Dentro' },
  { value: 'center', label: 'Centro' },
  { value: 'outside', label: 'Fuera' },
];

export default function StepPersonalize({
  filters,
  tag,
  personalization,
  onPersonalizationChange,
  onComplete,
  onBack,
}: StepPersonalizeProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
  console.log(personalization, 'personalizationpersonalization');
  const handleChange =
    (field: keyof PersonalizationData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onPersonalizationChange({
        ...personalization,
        [field]: event.target.value,
      });
    };

  const handleSliderChange =
    (field: keyof PersonalizationData) =>
    (event: Event, value: number | number[]) => {
      onPersonalizationChange({
        ...personalization,
        [field]: value,
      });
    };

  const handleIconSelect = (icon: string) => {
    onPersonalizationChange({
      ...personalization,
      icon,
    });
  };

  const handleColorChange =
    (field: keyof PersonalizationData) => (color: string) => {
      onPersonalizationChange({
        ...personalization,
        [field]: color,
      });
    };

  // Previsualización del stroke en el control
  const StrokePreview = ({
    color,
    width,
  }: {
    color?: string;
    width?: number;
  }) => (
    <Box
      sx={{
        width: '100%',
        height: 40,
        borderRadius: 1,
        border: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          color: personalization.fontColor || '#000000',
          WebkitTextStroke: `${width || 0}px ${color || '#000000'}`,
          textStroke: `${width || 0}px ${color || '#000000'}`,
          fontSize: 18,
        }}
      >
        Ejemplo
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personaliza tu plaquita
      </Typography>

      <Grid container spacing={3}>
        {/* Preview de la plaquita */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom align="center">
              Vista previa
            </Typography>
            <TagPreview
              filters={filters}
              tag={tag}
              personalization={personalization}
              onPersonalizationChange={onPersonalizationChange}
              showControls={true}
            />
          </Paper>
        </Grid>

        {/* Controles de personalización */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información básica */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Iconify icon="mdi:format-text" fontSize={20} />
                Información
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Nombre de la mascota"
                  value={personalization.name}
                  onChange={handleChange('name')}
                  fullWidth
                  required
                  helperText="Ingresa el nombre de tu mascota"
                />

                <TextField
                  label="Número de teléfono"
                  value={personalization.phone}
                  onChange={handleChange('phone')}
                  fullWidth
                  placeholder="8888-8888"
                  helperText="Ejemplo: 8888-8888"
                />
              </Stack>
            </Paper>

            {/* Configuración de texto */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Iconify icon="mdi:format-size" fontSize={20} />
                Configuración de texto
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Tamaño del nombre:{' '}
                    {personalization.nameFontSize ||
                      personalization.fontSize ||
                      36}
                    px
                  </Typography>
                  <Slider
                    value={
                      personalization.nameFontSize ||
                      personalization.fontSize ||
                      36
                    }
                    onChange={(e, value) => {
                      onPersonalizationChange({
                        ...personalization,
                        nameFontSize: value as number,
                      });
                    }}
                    min={12}
                    max={72}
                    marks={[
                      { value: 12, label: '12' },
                      { value: 24, label: '24' },
                      { value: 36, label: '36' },
                      { value: 48, label: '48' },
                      { value: 72, label: '72' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Tamaño del teléfono:{' '}
                    {(personalization.phoneFontSize ||
                      personalization.fontSize ||
                      36) * 0.7}
                    px
                  </Typography>
                  <Slider
                    value={
                      personalization.phoneFontSize ||
                      personalization.fontSize ||
                      36
                    }
                    onChange={(e, value) => {
                      onPersonalizationChange({
                        ...personalization,
                        phoneFontSize: value as number,
                      });
                    }}
                    min={12}
                    max={72}
                    marks={[
                      { value: 12, label: '12' },
                      { value: 24, label: '24' },
                      { value: 36, label: '36' },
                      { value: 48, label: '48' },
                      { value: 72, label: '72' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Fuente</InputLabel>
                  <Select
                    value={personalization.fontFamily || 'Comic Sans MS'}
                    label="Fuente"
                    onChange={(e) =>
                      onPersonalizationChange({
                        ...personalization,
                        fontFamily: e.target.value,
                      })
                    }
                  >
                    {fontOptions.map((font) => (
                      <MenuItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Color del texto
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: personalization.fontColor || '#000000',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      startIcon={<Iconify icon="mdi:format-color-fill" />}
                    >
                      {showColorPicker ? 'Cerrar' : 'Seleccionar color'}
                    </Button>
                  </Box>
                  {showColorPicker && (
                    <Box sx={{ mt: 2 }}>
                      <MuiColorInput
                        format="hex"
                        value={
                          (personalization.fontColor as MuiColorInputValue) ||
                          '#000000'
                        }
                        onChange={handleColorChange('fontColor')}
                        label="Color del texto"
                        fullWidth
                      />
                    </Box>
                  )}
                </Box>
              </Stack>
            </Paper>

            {/* Configuración de Stroke (Contorno) */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Iconify icon="mdi:border-color" fontSize={20} />
                Contorno del texto (Stroke)
              </Typography>

              <Stack spacing={2}>
                {/* Previsualización del stroke */}
                <StrokePreview
                  color={personalization.strokeColor}
                  width={personalization.strokeWidth}
                />

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Grosor del contorno: {personalization.strokeWidth || 0}px
                  </Typography>
                  <Slider
                    value={personalization.strokeWidth || 0}
                    onChange={handleSliderChange('strokeWidth')}
                    min={0}
                    max={10}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 2, label: '2' },
                      { value: 5, label: '5' },
                      { value: 8, label: '8' },
                      { value: 10, label: '10' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                  <FormHelperText>
                    {personalization.strokeWidth === 0
                      ? 'Sin contorno'
                      : `${personalization.strokeWidth}px de grosor`}
                  </FormHelperText>
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Posición del contorno</InputLabel>
                  <Select
                    value={personalization.strokePosition || 'outside'}
                    label="Posición del contorno"
                    onChange={(e) =>
                      onPersonalizationChange({
                        ...personalization,
                        strokePosition: e.target.value as
                          | 'inside'
                          | 'outside'
                          | 'center',
                      })
                    }
                    disabled={
                      !personalization.strokeWidth ||
                      personalization.strokeWidth === 0
                    }
                  >
                    {strokePositionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {!personalization.strokeWidth ||
                    personalization.strokeWidth === 0
                      ? 'Habilita el contorno para cambiar la posición'
                      : `Contorno: ${strokePositionOptions.find((o) => o.value === personalization.strokePosition)?.label}`}
                  </FormHelperText>
                </FormControl>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Color del contorno
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: personalization.strokeColor || '#000000',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        opacity:
                          !personalization.strokeWidth ||
                          personalization.strokeWidth === 0
                            ? 0.3
                            : 1,
                      }}
                      onClick={() => {
                        if (
                          personalization.strokeWidth &&
                          personalization.strokeWidth > 0
                        ) {
                          setShowStrokeColorPicker(!showStrokeColorPicker);
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (
                          personalization.strokeWidth &&
                          personalization.strokeWidth > 0
                        ) {
                          setShowStrokeColorPicker(!showStrokeColorPicker);
                        }
                      }}
                      startIcon={<Iconify icon="mdi:border-color" />}
                      disabled={
                        !personalization.strokeWidth ||
                        personalization.strokeWidth === 0
                      }
                    >
                      {showStrokeColorPicker ? 'Cerrar' : 'Seleccionar color'}
                    </Button>
                  </Box>
                  {showStrokeColorPicker && (
                    <Box sx={{ mt: 2 }}>
                      <MuiColorInput
                        format="hex"
                        value={
                          (personalization.strokeColor as MuiColorInputValue) ||
                          '#000000'
                        }
                        onChange={handleColorChange('strokeColor')}
                        label="Color del contorno"
                        fullWidth
                      />
                    </Box>
                  )}
                </Box>
              </Stack>
            </Paper>

            {/* Íconos */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Iconify icon="mdi:emoticon-happy" fontSize={20} />
                Ícono (opcional)
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {iconOptions.map((icon) => (
                  <Chip
                    key={icon}
                    label={icon}
                    onClick={() => handleIconSelect(icon)}
                    variant={
                      personalization.icon === icon ? 'filled' : 'outlined'
                    }
                    color={
                      personalization.icon === icon ? 'primary' : 'default'
                    }
                    sx={{ fontSize: '1.2rem', minWidth: 40 }}
                  />
                ))}
                <Chip
                  label="Quitar ícono"
                  onClick={() => handleIconSelect('')}
                  variant={!personalization.icon ? 'filled' : 'outlined'}
                  color={!personalization.icon ? 'secondary' : 'default'}
                />
              </Stack>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Atrás</Button>
        <Button
          variant="contained"
          onClick={onComplete}
          disabled={!personalization.name}
        >
          Finalizar
        </Button>
      </Box>
    </Box>
  );
}
