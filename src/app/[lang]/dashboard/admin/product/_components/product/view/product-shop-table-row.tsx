import Label from '@/components/label';
import Iconify from '@/components/iconify';
import { useTranslation } from 'react-i18next';
import { IProductItem } from '@/types/product';
import { useBoolean } from '@/hooks/use-boolean';
import { fDate, fTime } from '@/utils/format-time';
import { useCurrency } from '@/hooks/use-currency';
import { ConfirmDialog } from '@/components/custom-dialog';
import { inventoryStatusOptions } from '@/utils/constants';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, LinearProgress } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

// ----------------------------------------------------------------------

type Props = {
  row: IProductItem;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
};

export default function ProductTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const {
    name,
    createdAt,
    category,
    coverUrl,
    available,
    quantity,
    inventoryType,
    price,
    priceSale,
    publish,
  } = row;
  const { formatCurrency } = useCurrency();

  const confirm = useBoolean();

  const { t } = useTranslation();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={name}
          src={coverUrl}
          variant="rounded"
          sx={{ width: 64, height: 64, mr: 2 }}
        />

        <ListItemText
          primary={name}
          secondary={category}
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
        <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
          <LinearProgress
            value={(available * 100) / quantity}
            variant="determinate"
            color={
              (inventoryType === 'out_of_stock' && 'error') ||
              (inventoryType === 'low_stock' && 'warning') ||
              'success'
            }
            sx={{ mb: 1, height: 6, maxWidth: 80 }}
          />
          {!!available && available}{' '}
          {inventoryStatusOptions.find(
            (option) => option.value === inventoryType
          )?.label || 'Unknown'}
        </Stack>
      </TableCell>

      <TableCell sx={{ textTransform: 'capitalize' }}>
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {price && (
            <Box
              component="span"
              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
            >
              {formatCurrency(price)}
            </Box>
          )}

          <Box component="span">{formatCurrency(priceSale)}</Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={(publish === 'published' && 'info') || 'default'}
        >
          {publish}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
        {/* edit item */}
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('Edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('Delete')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('View')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}
