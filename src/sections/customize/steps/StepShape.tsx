// src/components/catalog/steps/StepShape.tsx
'use client';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/system/useMediaQuery';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from '@mui/material';

import { TagFilters, TagShape } from '../../../types/pet-tag.types';
import {
  shapeImages,
  sizeLabels,
  petTypeLabels,
} from '../../../utils/pet-tag-utils';
interface StepShapeProps {
  filters: TagFilters;
  onFilterChange: (filters: Partial<TagFilters>) => void;
  onNext: () => void;
  onBack?: () => void;
  isShapeStep?: boolean;
  hideBackButtom?: boolean;
}

const shapeData: Array<{
  value: TagShape;
  label: string;
  image: string;
  size: Array<{
    value: string;
    label: string;
  }>;
}> = [
  {
    value: 'bone',
    label: 'Hueso',
    image: shapeImages.bone,
    size: [
      { value: 'small', label: 'Pequeño (3.5cm x 2.5cm)' },
      { value: 'large', label: 'Grande (5cm x 3cm)' },
    ],
  },
  {
    value: 'heart',
    label: 'Corazón',
    image: shapeImages.heart,
    size: [{ value: 'medium', label: 'Mediano (3cm x 3.5cm)' }],
  },
  {
    value: 'circle',
    label: 'Circular',
    image: shapeImages.circle,
    size: [{ value: 'medium', label: 'Mediano (3cm x 3cm)' }],
  },
];

export default function StepShape({
  filters,
  onFilterChange,
  onNext,
  onBack,
  isShapeStep = false,
  hideBackButtom = false,
}: StepShapeProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleShapeSelect = (shape: TagShape) => {
    onFilterChange({ shape });
    // if (isShapeStep) {
    //   onNext();
    // }
  };

  if (isShapeStep) {
    return (
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Selecciona la forma de tu plaquita
        </Typography>
        <Grid container spacing={isMobile ? 1 : 2} sx={{ m: isMobile ? 0 : 1 }}>
          {shapeData.map((shape) => (
            <Grid size={{ xs: 6, sm: 4 }} key={shape.value}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border:
                    filters.shape === shape.value
                      ? '3px solid #1976d2'
                      : 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => handleShapeSelect(shape.value)}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? '140' : '240'}
                  image={shape.image}
                  alt={shape.label}
                  sx={{ objectFit: 'cover', p: 2, bgcolor: '#fff' }}
                />
                <CardContent
                  sx={{
                    bgcolor: 'background.neutral',
                    p: {
                      xs: 1,
                      md: 2,
                    },
                  }}
                >
                  <Typography variant="h6" align="center">
                    {shape.label}
                  </Typography>

                  {shape.size.map((s) => (
                    <Typography
                      key={s.value}
                      variant="body2"
                      color="text.secondary"
                    >
                      ° {s.label}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {!hideBackButtom && (
          <Box sx={{ mt: 3 }}>
            {onBack && (
              <Button onClick={onBack} sx={{ mr: 1 }}>
                Atrás
              </Button>
            )}
            <Button
              variant="contained"
              onClick={onNext}
              disabled={!filters.shape}
            >
              Continuar
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  // Paso de tipo y tamaño
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ¿Para quién es la plaquita?
      </Typography>
      <ToggleButtonGroup
        value={filters.petType}
        exclusive
        onChange={(e, value) => onFilterChange({ petType: value })}
        sx={{ mb: 3 }}
      >
        {Object.entries(petTypeLabels).map(([key, label]) => (
          <ToggleButton key={key} value={key}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {filters.petType && (
        <>
          <Typography variant="h6" gutterBottom>
            Tamaño de tu mascota
          </Typography>
          <ToggleButtonGroup
            value={filters.size}
            exclusive
            onChange={(e, value) => onFilterChange({ size: value })}
          >
            {Object.entries(sizeLabels).map(([key, label]) => (
              <ToggleButton key={key} value={key}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </>
      )}

      <Box sx={{ mt: 3 }}>
        {onBack && (
          <Button onClick={onBack} sx={{ mr: 1 }}>
            Atrás
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!filters.petType || !filters.size}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}
