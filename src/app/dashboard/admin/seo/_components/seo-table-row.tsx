// components/seo-table-row.tsx
import { useState } from 'react';
import { ISeo } from '@/src/types/api';
import { fDate, fTime } from '@/src/utils/format-time';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Chip, Stack, Tooltip, Checkbox, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import SeoQuickEditForm from './seo-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: ISeo;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  refetch: () => void;
};

export default function SeoTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  refetch,
}: Props) {
  const {
    _id,
    pageId,
    route,
    contentType,
    status,
    priority,
    multiLanguageContent,
    lastModified,
    createdAt,
    updatedAt,
  } = row;

  const popover = usePopover();
  const quickEdit = useBoolean();

  const [menuState, setMenuState] = useState({
    view: false,
    edit: false,
    delete: false,
  });

  const getStatusColor = (pStatus: string) => {
    switch (pStatus) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'primary';
      case 'product':
        return 'secondary';
      case 'article':
        return 'info';
      case 'category':
        return 'success';
      case 'landing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const languages = multiLanguageContent
    .map((content) => content.language)
    .join(', ');

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={pageId || 'N/A'}
            secondary={route || 'N/A'}
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
            primary={fDate(lastModified) || 'N/A'}
            secondary={fTime(lastModified) || 'N/A'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />{' '}
        </TableCell>

        <TableCell>
          <Chip
            label={contentType}
            color={getContentTypeColor(contentType) as any}
            size="small"
            variant="outlined"
          />
        </TableCell>
        <TableCell>
          <Chip
            label={status}
            color={getStatusColor(status) as any}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {multiLanguageContent.slice(0, 3).map((content) => (
              <Chip
                key={content.language}
                label={content.language}
                size="small"
                variant="outlined"
              />
            ))}
            {multiLanguageContent.length > 3 && (
              <Chip
                label={`+${multiLanguageContent.length - 3}`}
                size="small"
                variant="filled"
              />
            )}
          </Stack>
        </TableCell>

        <TableCell align="center">{priority.toFixed(1)}</TableCell>

        <TableCell align="right" padding="none">
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              onClick={quickEdit.onTrue}
            >
              <Iconify icon="solar:pen-bold" />
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
            quickEdit.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <SeoQuickEditForm
        currentSeo={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        refetch={refetch}
      />
    </>
  );
}
