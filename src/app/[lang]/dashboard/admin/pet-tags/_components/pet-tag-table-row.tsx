'use client';

import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import {
  Chip,
  Stack,
  Tooltip,
  Checkbox,
  ListItemText,
  Typography,
} from '@mui/material';

import Iconify from '@/components/iconify';
import { IPetTagOrder } from '@/types/pet-tag';
import { useBoolean } from '@/hooks/use-boolean';
import { fDate, fTime } from '@/utils/format-time';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import PetTagQuickView from './pet-tag-quick-view';

type Props = {
  row: IPetTagOrder;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
  onUpdateStatusAction: (id: string, status: string) => void;
  onRefetchAction: () => void;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: 'warning' | 'info' | 'success' | 'error' | 'default' }
> = {
  pending: { label: 'Pendiente', color: 'warning' },
  'in-progress': { label: 'En proceso', color: 'info' },
  completed: { label: 'Completado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
};

const SHAPE_LABELS: Record<string, string> = {
  bone: '🦴 Hueso',
  heart: '❤️ Corazón',
  circle: '⭕ Círculo',
};

const MATERIAL_LABELS: Record<string, string> = {
  resin: 'Resina',
  aluminum: 'Aluminio',
};

export default function PetTagTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onViewRow: _onViewRow,
  onUpdateStatusAction,
  onRefetchAction,
}: Props) {
  const {
    _id,
    contactName,
    contactPhone,
    material,
    size,
    front,
    back,
    status,
    createdAt,
    shape,
  } = row;

  const popover = usePopover();
  const quickView = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {/* Contacto */}
        <TableCell>
          <ListItemText
            primary={contactName}
            secondary={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify
                  icon="mdi:whatsapp"
                  width={14}
                  sx={{ color: 'success.main' }}
                />
                <Typography variant="caption">{contactPhone}</Typography>
              </Stack>
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ component: 'span' }}
          />
        </TableCell>

        {/* WhatsApp */}
        <TableCell>
          <Typography variant="body2">{contactPhone}</Typography>
        </TableCell>

        {/* Plaquita */}
        <TableCell>
          <ListItemText
            primary={SHAPE_LABELS[shape] || shape}
            secondary={MATERIAL_LABELS[material] || material}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        {/* Tamaño */}
        <TableCell>
          <Typography variant="body2">{size}</Typography>
        </TableCell>

        {/* Imágenes */}
        <TableCell align="center">
          <Chip
            label={(front?.image?.imageURL ? 1 : 0) + (back?.image?.imageURL ? 1 : 0)}
            size="small"
            icon={<Iconify icon="mdi:image-outline" width={14} />}
            variant="outlined"
          />
        </TableCell>

        {/* Estado */}
        <TableCell align="center">
          <Chip
            label={STATUS_CONFIG[status]?.label || status}
            color={STATUS_CONFIG[status]?.color || 'default'}
            size="small"
          />
        </TableCell>

        {/* Fecha */}
        <TableCell>
          <ListItemText
            primary={fDate(createdAt) || 'N/A'}
            secondary={fTime(createdAt) || 'N/A'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        {/* Acciones */}
        <TableCell align="right" padding="none">
          <Tooltip title="Ver detalle" placement="top" arrow>
            <IconButton onClick={quickView.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
          <IconButton
            color={popover.open ? 'primary' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            quickView.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Ver detalle
        </MenuItem>

        <MenuItem
          onClick={() => {
            onUpdateStatusAction(_id, 'in-progress');
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:progress-clock" />
          En proceso
        </MenuItem>

        <MenuItem
          onClick={() => {
            onUpdateStatusAction(_id, 'completed');
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:check-circle" />
          Completado
        </MenuItem>

        <MenuItem
          onClick={() => {
            onUpdateStatusAction(_id, 'cancelled');
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:close-circle" />
          Cancelado
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Eliminar
        </MenuItem>
      </CustomPopover>

      <PetTagQuickView
        open={quickView.value}
        petTag={row}
        onCloseAction={quickView.onFalse}
        onRefetchAction={onRefetchAction}
        onUpdateStatusAction={onUpdateStatusAction}
      />
    </>
  );
}
