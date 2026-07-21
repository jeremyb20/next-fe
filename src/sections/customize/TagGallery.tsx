// src/components/catalog/TagGallery.tsx
'use client';
import { m } from 'motion/react';
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
  IconButton,
} from '@mui/material';

import Iconify from '@/components/iconify';

import {
  PersonalizationData,
  TagFilters,
  TagOption,
} from '../../types/pet-tag.types';

interface TagGalleryProps {
  filters?: TagFilters;
  tags: TagOption[];
  onSelectTag: (tag: TagOption) => void;
  onCustomize: () => void;
  personalization: PersonalizationData;
  onPersonalizationChange: (data: PersonalizationData) => void;
}

export default function TagGallery({
  tags,
  onSelectTag,
  onCustomize,
  personalization,
  onPersonalizationChange,
}: TagGalleryProps) {
  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Fondos disponibles</Typography>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<span>✨</span>}
          onClick={onCustomize}
        >
          Personalizar mi plaquita
        </Button>
      </Box>

      {tags.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No hay plaquitas disponibles con estos filtros.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Puedes personalizar tu propia plaquita.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={onCustomize}
          >
            Crear plaquita personalizada
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tags.map((tag, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tag.id}>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                  onClick={() => {
                    onPersonalizationChange({
                      ...personalization,
                      name: tag.name,
                      phone: tag.phone,
                    });
                    onSelectTag(tag);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={tag.imageUrl}
                    alt={`Plaquita ${tag.shape}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {tag.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      gap={0.5}
                    >
                      <Chip
                        label={tag.material}
                        size="small"
                        variant="outlined"
                      />
                      <Chip label={tag.shape} size="small" variant="outlined" />
                    </Stack>
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Lógica para favorito
                        }}
                      >
                        {/* <Favorite fontSize="small" /> */}
                        <Iconify icon="material-symbols:favorite-outline" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Lógica para compartir
                        }}
                      >
                        <Iconify icon="solar:share-bold" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </m.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
