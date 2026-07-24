// src/components/catalog/steps/StepMaterial.tsx
'use client';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/system/useMediaQuery';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from '@mui/material';

import { TagFilters, TagMaterial } from '../../../types/pet-tag.types';
interface StepMaterialProps {
  filters: TagFilters;
  onFilterChange: (filters: Partial<TagFilters>) => void;
  onNext: () => void;
}

const materials = [
  {
    value: 'resin' as TagMaterial,
    label: 'Resina',
    description: 'Ligera, duradera y resistente a la intemperie',
    image: '/assets/images/customize/resin.png',
  },
  {
    value: 'aluminum' as TagMaterial,
    label: 'Aluminio',
    description: 'Robusta, elegante y resistente a arañazos',
    image: '/assets/images/customize/aluminum.png',
  },
];

export default function StepMaterial({
  filters,
  onFilterChange,
  onNext,
}: StepMaterialProps) {
  const handleMaterialSelect = (material: TagMaterial) => {
    onFilterChange({ material });
    onNext();
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Elige el material de tu plaquita
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {materials.map((material) => (
          <Grid size={{ xs: 12, sm: 6 }} key={material.value}>
            <Card
              sx={{
                cursor: 'pointer',
                border:
                  filters.material === material.value
                    ? '3px solid #1976d2'
                    : 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => handleMaterialSelect(material.value)}
            >
              <CardMedia
                component="img"
                height={isMobile ? '210' : '310'}
                image={material.image}
                alt={material.label}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ bgcolor: 'background.neutral' }}>
                <Typography variant="h6" gutterBottom>
                  {material.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {material.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3 }}>
        {/* <Button onClick={onBack} sx={{ mr: 1 }}>
          Atrás
        </Button> */}
        <Button variant="contained" onClick={onNext} disabled={!filters.shape}>
          Continuar
        </Button>
      </Box>
    </Box>
  );
}
