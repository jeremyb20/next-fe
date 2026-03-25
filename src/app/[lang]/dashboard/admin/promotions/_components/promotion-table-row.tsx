/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import Label from '@/components/label';
import { IPromotions } from '@/types/api';
import Iconify from '@/components/iconify';
import { useBoolean } from '@/hooks/use-boolean';
import { fDate, fTime } from '@/utils/format-time';
import { ConfirmDialog } from '@/components/custom-dialog';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Dialog, Typography, DialogTitle, DialogContent } from '@mui/material';

import PromotionEditForm from './promotion-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: IPromotions;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  refetchAll: VoidFunction;
};

export default function PromotionTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  refetchAll,
}: Props) {
  const {
    createdAt,
    updatedAt,
    status,
    title,
    description,
    discount,
    type,
    validFrom,
    validUntil,
    // urlImage,
    // urlImageId,
    // icon,
    // priority,

    // termsAndConditions,
    // applicableTo,
    code,
    // usageLimit,
    // usedCount,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const [editQrCode, setEditQrCode] = useState(false);

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={title || 'N/A'}
          secondary={description || 'N/A'}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

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

      <TableCell>
        <ListItemText
          primary={fDate(updatedAt) || 'N/A'}
          secondary={fTime(updatedAt) || 'N/A'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">{discount}</TableCell>
      <TableCell align="center">{code}</TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(validFrom) || 'N/A'}
          secondary={fDate(validUntil) || 'N/A'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell align="center">
        <Label variant="soft">{type}</Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') ||
            (status === 'expired' && 'warning') ||
            (status === 'inactive' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* )} */}

        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={() => setEditQrCode(true)}>
          <Iconify icon="solar:qr-code-linear" />
          Edit QR Code
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
      <Dialog open={editQrCode} maxWidth="xl">
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            component={Paper}
            sx={{ width: '100%' }}
          >
            <Typography variant="h6">Edit promotion</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => setEditQrCode(false)}
            >
              Close
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <PromotionEditForm
            currentPromotion={row}
            close={setEditQrCode}
            refetchAll={refetchAll}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
