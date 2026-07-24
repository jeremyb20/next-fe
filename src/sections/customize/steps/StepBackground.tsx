'use client';
import React, { useState, useRef } from 'react';
import useMediaQuery from '@mui/system/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';

import Iconify from '@/components/iconify';

import { backgroundOptions } from '../../../utils/pet-tag-utils';

interface StepBackgroundProps {
  selectedBackground: string;
  onSelectBackground: (background: string) => void;
  onSelectBackgroundFile?: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}

const categories = {
  solid: 'Sólidos',
  pattern: 'Patrones',
  image: 'Imágenes',
};

export default function StepBackground({
  selectedBackground,
  onSelectBackground,
  onSelectBackgroundFile,
  onNext,
  onBack,
}: StepBackgroundProps) {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const [fileName, setFileName] = useState<File | undefined>(undefined);
  const [fileURL, setFileURL] = useState<string>('');

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file);
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileURL(url);
    onSelectBackground(url);
    onSelectBackgroundFile?.(file);
  };

  const filteredBackgrounds =
    filterCategory && filterCategory !== 'image'
      ? backgroundOptions.filter((bg) => bg.category === filterCategory)
      : filterCategory === 'image'
        ? []
        : backgroundOptions;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Selecciona el fondo de tu plaquita
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
      >
        <Chip
          label="Todos"
          onClick={() => setFilterCategory(null)}
          color={!filterCategory ? 'primary' : 'default'}
          variant={!filterCategory ? 'filled' : 'outlined'}
        />
        {Object.entries(categories).map(([key, label]) => (
          <Chip
            key={key}
            label={label}
            onClick={() => setFilterCategory(key)}
            color={filterCategory === key ? 'primary' : 'default'}
            variant={filterCategory === key ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      {/* Subir imagen desde dispositivo */}
      {(filterCategory === 'image' || !filterCategory) && (
        <Box
          sx={{
            mb: 3,
            p: 3,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={3}
          >
            <Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Iconify
                icon="mdi:cloud-upload-outline"
                width={40}
                sx={{ color: 'text.secondary', mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {fileName
                  ? fileName.name
                  : 'Haz clic para subir una imagen desde tu dispositivo'}
              </Typography>
              {fileName && (
                <Typography variant="caption" color="text.secondary">
                  {fileName.size > 1024 * 1024
                    ? `${(fileName.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(fileName.size / 1024).toFixed(2)} KB`}
                </Typography>
              )}
            </Box>
            <Box>
              {fileName && (
                <Box>
                  <CardMedia
                    component="img"
                    height="140"
                    image={fileURL}
                    alt={fileName.name}
                    sx={{ objectFit: 'cover', borderRadius: 2 }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          maxHeight: isMobile ? '50dvh' : 400, // Altura máxima del contenedor
          overflowY: 'auto', // Scroll vertical
          overflowX: 'hidden', // Ocultar scroll horizontal
          pr: 1, // Padding right para espacio del scroll
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.grey[500], 0.1),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.grey[500], 0.3),
            borderRadius: '10px',
            '&:hover': {
              background: alpha(theme.palette.grey[500], 0.5),
            },
          },
          // Soporte para Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(
            theme.palette.grey[500],
            0.3
          )} ${alpha(theme.palette.grey[500], 0.1)}`,
        }}
      >
        <Grid container spacing={2}>
          {filteredBackgrounds.map((bg) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={bg.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border:
                    selectedBackground === bg.imageUrl
                      ? '3px solid #1976d2'
                      : 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => onSelectBackground(bg.imageUrl)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={bg.imageUrl}
                  alt={bg.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ bgcolor: 'background.neutral' }}>
                  <Typography variant="body2" align="center">
                    {bg.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 3 }}>
        <Button onClick={onBack} sx={{ mr: 1 }}>
          Atrás
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!selectedBackground}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}
