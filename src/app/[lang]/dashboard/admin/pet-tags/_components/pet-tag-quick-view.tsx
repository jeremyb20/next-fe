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

import Iconify from '@/components/iconify';
import { fDate, fTime } from '@/utils/format-time';
import { IPetTagOrder, ITagSide } from '@/types/pet-tag';
import TagPreview from '@/sections/customize/TagPreview';
import {
  TagOption,
  TagFilters,
  PersonalizationData,
} from '@/types/pet-tag.types';

type Props = {
  open: boolean;
  petTag?: IPetTagOrder;
  onCloseAction: VoidFunction;
  onRefetchAction: VoidFunction;
  onUpdateStatusAction: (id: string, status: string) => void;
};

type TagStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in-progress', label: 'En proceso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'rejected', label: 'Rechazado' },
];

const STATUS_COLOR: Record<
  string,
  'warning' | 'info' | 'success' | 'error' | 'default'
> = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
  cancelled: 'error',
  rejected: 'error',
};

function buildSidePreview(
  side: ITagSide | undefined,
  petTag: IPetTagOrder
): {
  tag: TagOption;
  filters: TagFilters;
  personalization: PersonalizationData;
} {
  const p = side?.personalization;
  const bg = side?.image?.imageURL || side?.background || '';

  const tag: TagOption = {
    id: 'custom',
    shape: petTag.shape || 'circle',
    material: petTag.material || 'resin',
    background: bg,
    name: p?.name || '',
    phone: p?.phone || '',
    imageUrl: side?.image?.imageURL || '',
    isCustomizable: false,
  };

  const filters: TagFilters = {
    petType: (petTag.petType as any) || '',
    size: (petTag.size as any) || '',
    material: (petTag.material as any) || '',
    shape: (petTag.shape as any) || 'circle',
  };

  const personalization: PersonalizationData = {
    name: p?.name || '',
    phone: p?.phone || '',
    fontSize: p?.fontSize,
    nameFontSize: p?.nameFontSize,
    phoneFontSize: p?.phoneFontSize,
    fontColor: p?.fontColor || '#ffffff',
    strokeColor: p?.strokeColor,
    strokeWidth: p?.strokeWidth,
    strokePosition: p?.strokePosition,
    fontFamily: p?.fontFamily,
    moldScale: p?.moldScale,
    doubleSided: !!petTag.back,
    namePosition: p?.namePosition,
    phonePosition: p?.phonePosition,
  };

  return { tag, filters, personalization };
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
    contactNote,
    front,
    back,
    status,
    createdAt,
    updatedAt,
  } = petTag;

  const isDoubleSided = !!back;
  const activeSideData = previewSide === 'back' && isDoubleSided ? back : front;
  const preview = buildSidePreview(activeSideData, petTag);

  const frontP = front?.personalization;
  const backP = back?.personalization;

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
            {isDoubleSided && (
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
              personalization={preview.personalization}
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
              {contactNote && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    Nota
                  </Typography>
                  <Typography variant="body2">{contactNote}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider />

          {/* Plaquita */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Plaquita
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Forma
                </Typography>
                <Typography variant="body2">{petTag.shape || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Material
                </Typography>
                <Typography variant="body2">
                  {petTag.material || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Tamaño
                </Typography>
                <Typography variant="body2">{petTag.size || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Tipo mascota
                </Typography>
                <Typography variant="body2">{petTag.petType || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Doble cara
                </Typography>
                <Chip
                  label={isDoubleSided ? 'Sí' : 'No'}
                  size="small"
                  color={isDoubleSided ? 'primary' : 'default'}
                  variant="outlined"
                />
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

          {/* Personalización cara frontal */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Personalización — Cara frontal
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Nombre mascota
                </Typography>
                <Typography variant="body2">{frontP?.name || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body2">{frontP?.phone || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Fuente
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontFamily: frontP?.fontFamily }}
                >
                  {frontP?.fontFamily || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Color texto
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 0.5,
                      bgcolor: frontP?.fontColor || '#fff',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Typography variant="body2">
                    {frontP?.fontColor || '-'}
                  </Typography>
                </Stack>
              </Grid>
              {front?.background && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Fondo
                  </Typography>
                  <Box
                    component="img"
                    src={front.image?.imageURL || front.background}
                    alt="Fondo frontal"
                    onClick={() =>
                      window.open(
                        front.image?.imageURL || front.background,
                        '_blank'
                      )
                    }
                    sx={{
                      display: 'block',
                      mt: 0.5,
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
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Personalización cara trasera */}
          {isDoubleSided && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Personalización — Cara trasera
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Nombre mascota
                    </Typography>
                    <Typography variant="body2">
                      {backP?.name || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body2">
                      {backP?.phone || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Fuente
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontFamily: backP?.fontFamily }}
                    >
                      {backP?.fontFamily || '-'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Color texto
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 0.5,
                          bgcolor: backP?.fontColor || '#fff',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                      <Typography variant="body2">
                        {backP?.fontColor || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  {back?.background && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Fondo
                      </Typography>
                      <Box
                        component="img"
                        src={back.image?.imageURL || back.background}
                        alt="Fondo trasero"
                        onClick={() =>
                          window.open(
                            back.image?.imageURL || back.background,
                            '_blank'
                          )
                        }
                        sx={{
                          display: 'block',
                          mt: 0.5,
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
                    </Grid>
                  )}
                </Grid>
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
            {updatedAt && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Actualizado
                </Typography>
                <Typography variant="body2">
                  {fDate(updatedAt)} {fTime(updatedAt)}
                </Typography>
              </Grid>
            )}
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
