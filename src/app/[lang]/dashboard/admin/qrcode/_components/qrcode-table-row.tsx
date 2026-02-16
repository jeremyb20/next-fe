/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { IQrCode } from '@//types/api';
import Label from '@/components/label';
import Iconify from '@/components/iconify';
import { useBoolean } from '@/hooks/use-boolean';
import { BreedOptions } from '@//utils/constants';
import { fDate, fTime } from '@/utils/format-time';
import { ConfirmDialog } from '@/components/custom-dialog';
import { QrcodeCustom } from '@//components/qr-generator/qr-codes';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: IQrCode;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function QrCodeTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const {
    assignedPet,
    createdAt,
    updatedAt,
    status,
    randomCode,
    hostName,
    assignedTo,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const [editQrCode, setEditQrCode] = useState(false);

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={assignedTo?.email || 'N/A'}
          secondary={
            BreedOptions.todos.find(
              (breed) => breed.value === assignedPet?.breed
            )?.label || 'Unknown breed'
          }
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

      <TableCell align="center">{randomCode}</TableCell>
      <TableCell align="center">{hostName}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'available' && 'success') ||
            (status === 'expired' && 'warning') ||
            (status === 'activated' && 'error') ||
            (status === 'assigned' && 'info') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>
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

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack direction="row" component={Paper} sx={{ m: 1.5, p: 2 }}>
            <QrcodeCustom
              value={`${hostName}pet/${randomCode}`}
              fileName={randomCode}
            />
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

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
            justifyContent="flex-end"
            component={Paper}
            sx={{ width: '100%' }}
          >
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
          <QrcodeCustom
            value={`${hostName}pet/${randomCode}`}
            fileName={randomCode}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
