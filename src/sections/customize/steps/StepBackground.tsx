'use client';
import React, { useState } from 'react';
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

import { backgroundOptions } from '../../../utils/pet-tag-utils';

interface StepBackgroundProps {
  selectedBackground: string;
  onSelectBackground: (background: string) => void;
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
  onNext,
  onBack,
}: StepBackgroundProps) {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredBackgrounds = filterCategory
    ? backgroundOptions.filter((bg) => bg.category === filterCategory)
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

      <Grid container spacing={2}>
        {filteredBackgrounds.map((bg) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bg.id}>
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
              <CardContent>
                <Typography variant="body2" align="center">
                  {bg.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
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
