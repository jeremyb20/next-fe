'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

import { IPetTag } from '@/types/pet-tag';
import Iconify from '@/components/iconify';
import { fDate, fTime } from '@/utils/format-time';
import TagPreview from '@/sections/customize/TagPreview';
import {
  TagOption,
  TagFilters,
  PersonalizationData,
} from '@/types/pet-tag.types';

type Props = {
  open: boolean;
  petTag?: IPetTag;
  onCloseAction: VoidFunction;
  onRefetchAction: VoidFunction;
  onUpdateStatusAction: (id: string, status: string) => void;
};

type TagStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in-progress', label: 'En proceso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const STATUS_COLOR: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
  cancelled: 'error',
};

function buildPreviewProps(petTag: IPetTag): {
  tag: TagOption;
  filters: TagFilters;
  activePersonalization: PersonalizationData;
} {
  const tag: TagOption = {
    id: petTag.tag?.id || 'custom',
    shape: (petTag.tag?.shape as any) || 'circle',
    material: (petTag.tag?.material as any) || 'resin',
    background:
      (petTag.images?.length ?? 0) > 0
        ? petTag.images![0]?.imageURL
        : petTag.tag?.background,
    name: petTag.activePersonalization?.name || '',
    phone: petTag.activePersonalization?.phone || '',
    imageUrl: petTag.images?.[0]?.imageURL || '',
    isCustomizable: false,
  };

  const filters: TagFilters = {
    petType: (petTag.filters?.petType as any) || '',
    size: (petTag.filters?.size as any) || '',
    material: (petTag.tag?.material as any) || '',
    shape: (petTag.shape as any) || 'circle',
  };

  const activePersonalization: PersonalizationData = {
    name: petTag.activePersonalization?.name || '',
    phone: petTag.activePersonalization?.phone || '',
    fontSize: petTag.activePersonalization?.fontSize,
    nameFontSize: petTag.activePersonalization?.nameFontSize,
    phoneFontSize: petTag.activePersonalization?.phoneFontSize,
    fontColor: petTag.activePersonalization?.fontColor || '#ffffff',
    strokeColor: petTag.activePersonalization?.strokeColor,
    strokeWidth: petTag.activePersonalization?.strokeWidth,
    strokePosition: petTag.activePersonalization?.strokePosition,
    fontFamily: petTag.activePersonalization?.fontFamily,
    icon: petTag.activePersonalization?.icon,
    moldScale: petTag.activePersonalization?.moldScale,
    doubleSided: petTag.activePersonalization?.doubleSided,
  };

  return { tag, filters, activePersonalization };
}

export default function PetTagQuickView({
  open,
  petTag,
  onCloseAction,
  onRefetchAction,
  onUpdateStatusAction,
}: Props) {
  const [newStatus, setNewStatus] = useState<TagStatus>(
    (petTag?.status as TagStatus) || 'pending'
  );
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  if (!petTag) return null;

  const {
    _id,
    contactName,
    contactPhone,
    activePersonalization,
    tag,
    images,
    status,
    createdAt,
    updatedAt,
    shape,
  } = petTag;
  console.log(shape);
  const preview = buildPreviewProps(petTag);

  const handleStatusUpdate = () => {
    onUpdateStatusAction(_id, newStatus);
    onRefetchAction();
  };

  return (
    <Dialog open={open} onClose={onCloseAction} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:tag-outline" width={24} />
            <Typography variant="h6">Detalle del Pet Tag</Typography>
          </Stack>
          <IconButton onClick={onCloseAction}>
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Vista previa */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Vista previa
            </Typography>
            {activePersonalization?.doubleSided && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <ToggleButtonGroup
                  value={previewSide}
                  exclusive
                  onChange={(_, val) => val && setPreviewSide(val)}
                  size="small"
                >
                  <ToggleButton value="front">Cara frontal</ToggleButton>
                  <ToggleButton value="back">Cara trasera</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
            <TagPreview
              tag={preview.tag}
              filters={preview.filters}
              personalization={preview.activePersonalization}
              activeSide={previewSide}
              showControls={false}
            />
          </Box>

          <Divider />

          {/* Contacto */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Datos de contacto
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body2">{contactName}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  WhatsApp
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Iconify
                    icon="mdi:whatsapp"
                    width={16}
                    sx={{ color: 'success.main' }}
                  />
                  <Typography variant="body2">{contactPhone}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Plaquita */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Plaquita
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Forma
                </Typography>
                <Typography variant="body2">{tag?.shape || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Material
                </Typography>
                <Typography variant="body2">{tag?.material || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={
                    STATUS_OPTIONS.find((o) => o.value === status)?.label ||
                    status
                  }
                  color={STATUS_COLOR[status] || 'default'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Personalización */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Personalización
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Nombre mascota
                </Typography>
                <Typography variant="body2">
                  {activePersonalization?.name || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Teléfono en plaquita
                </Typography>
                <Typography variant="body2">
                  {activePersonalization?.phone || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Fuente
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontFamily: activePersonalization?.fontFamily }}
                >
                  {activePersonalization?.fontFamily || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Color texto
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 0.5,
                      bgcolor: activePersonalization?.fontColor || '#fff',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Typography variant="body2">
                    {activePersonalization?.fontColor}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Doble cara
                </Typography>
                <Chip
                  label={activePersonalization?.doubleSided ? 'Sí' : 'No'}
                  size="small"
                  color={
                    activePersonalization?.doubleSided ? 'primary' : 'default'
                  }
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Imágenes de fondo subidas */}
          {images && images.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Imágenes de fondo ({images.length})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {images.map((img, i) => (
                    <Box
                      key={img.imageID || i}
                      component="img"
                      src={img.imageURL}
                      alt={`Imagen ${i + 1}`}
                      onClick={() => window.open(img.imageURL, '_blank')}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </>
          )}

          <Divider />

          {/* Fechas */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Creado
              </Typography>
              <Typography variant="body2">
                {fDate(createdAt)} {fTime(createdAt)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Actualizado
              </Typography>
              <Typography variant="body2">
                {fDate(updatedAt)} {fTime(updatedAt)}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            select
            label="Actualizar estado"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as TagStatus)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={handleStatusUpdate}
            size="small"
            disabled={newStatus === status}
          >
            Actualizar
          </Button>
        </Box>
        <Button onClick={onCloseAction} color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
