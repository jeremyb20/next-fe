/* eslint-disable no-nested-ternary */
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// import { IOrderItem } from 'src/types/order';
import { IUser, IPetProfile } from '@/src/types/api';
import { IPInfoResponse } from '@/src/hooks/use-ip-info';
import { openLink, getUserRoleFromState } from '@/src/utils/constants';
import { useCopyToClipboard } from '@/src/hooks/use-copy-to-clipboard';
import { USER_STATUS_OPTIONS } from '@/src/components/filters/filter-constants';
import { AvatarWithSkeleton } from '@/src/components/avatar/avatar-with-skeleton';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Box, Tooltip } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Label, { LabelColor } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import PetQuickEditForm from './pet-quick-edit-form';
import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: IUser;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  ipDataInfo: IPInfoResponse | null;
  refetch: () => void;
};

export default function UserTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  ipDataInfo,
  refetch,
}: Props) {
  const { pets, createdAt, userStatus, email, id, updatedAt, role, memberId } =
    row;

  const confirm = useBoolean();

  const { t } = useTranslation();

  const collapse = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();
  const petQuickEdit = useBoolean();

  const { copy } = useCopyToClipboard();

  const { enqueueSnackbar } = useSnackbar();

  const [petSelected, setPetSelected] = useState<IPetProfile>();

  const handleCopy = useCallback(
    (item: string) => {
      enqueueSnackbar(`${item} Copied!`);
      copy(item);
    },
    [copy, enqueueSnackbar]
  );

  // Función para abrir el modal con la mascota seleccionada
  const handleOpenPetEdit = (pet: IPetProfile) => {
    console.log('Opening pet edit for:', pet);
    setPetSelected(pet);
    petQuickEdit.onTrue();
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={email} sx={{ mr: 2 }}>
          {' '}
          {email.charAt(0).toUpperCase()}{' '}
        </Avatar>

        <ListItemText
          primary={email}
          secondary={id}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        {' '}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
            },
          }}
          onClick={() => handleCopy(memberId)}
        >
          <Iconify icon="solar:copy-bold" width={15} /> {memberId || 'N/A'}
        </Box>
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

      <TableCell sx={{ textTransform: 'capitalize' }}>
        {getUserRoleFromState(role)}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            USER_STATUS_OPTIONS.find(
              (option) => option.value === userStatus.toString()
            )?.color as LabelColor
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {userStatus &&
            t(
              USER_STATUS_OPTIONS.find(
                (option) => option.value === userStatus.toString()
              )?.label || 'N/A'
            )}
        </Label>
      </TableCell>

      <TableCell align="center"> {pets ? pets.length : 0} </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          disabled={!pets || pets.length === 0}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify
            icon={
              !pets || pets.length === 0
                ? 'fe:disabled'
                : 'eva:arrow-ios-downward-fill'
            }
          />
        </IconButton>
        <Tooltip title="Quick Edit" placement="top" arrow>
          <IconButton
            color={quickEdit.value ? 'inherit' : 'default'}
            onClick={quickEdit.onTrue}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      {/* UserQuickEditForm dentro del TableRow está bien porque usa useBoolean */}
      <UserQuickEditForm
        currentUser={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        ipDataInfo={ipDataInfo}
        refetch={refetch}
      />
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {pets && pets.length > 0 && (
              <>
                {pets.map((item, index) => (
                  <Stack
                    key={item.memberPetId + index}
                    direction="row"
                    alignItems="center"
                    sx={{
                      p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                      '&:not(:last-of-type)': {
                        borderBottom: (theme) =>
                          `solid 2px ${theme.palette.background.neutral}`,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ width: 210, textAlign: 'left' }}
                    >
                      <AvatarWithSkeleton
                        src={item.photo}
                        alt={item.petName}
                        variant="rounded"
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />

                      <ListItemText
                        primary={item.petName}
                        secondary={item.petStatus || 'N/A'}
                        primaryTypographyProps={{
                          typography: 'body2',
                        }}
                        secondaryTypographyProps={{
                          component: 'span',
                          color: 'text.disabled',
                          mt: 0.5,
                        }}
                      />
                    </Stack>

                    <ListItemText
                      primary="Birth Date"
                      secondary={fDate(item.birthDate) || 'N/A'}
                      primaryTypographyProps={{
                        typography: 'body2',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />

                    <ListItemText
                      primary="Digital Id Active"
                      secondary={
                        item.isDigitalIdentificationActive ? 'Yes' : 'No'
                      }
                      primaryTypographyProps={{
                        typography: 'body2',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />

                    <ListItemText
                      primary="Last Update"
                      secondary={`${fDate(item.updatedAt)} ${fTime(
                        item.updatedAt
                      )}`}
                      primaryTypographyProps={{
                        typography: 'body2',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />

                    <ListItemText
                      primary="Phone"
                      secondary={item.phone || 'N/A'}
                      primaryTypographyProps={{
                        typography: 'body2',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />

                    <ListItemText
                      primary="Register Location"
                      secondary={
                        item.petViewCounter
                          ? item.petViewCounter.length || 'N/A'
                          : 'N/A'
                      }
                      primaryTypographyProps={{
                        typography: 'body2',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />
                    <ListItemText
                      primary="Code ID"
                      secondary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                          onClick={() => handleCopy(item.memberPetId)}
                        >
                          <Iconify icon="solar:copy-bold" width={15} />{' '}
                          {item.memberPetId || 'N/A'}
                        </Box>
                      }
                      primaryTypographyProps={{
                        typography: 'body2',
                        noWrap: true,
                        textAlign: 'left',
                      }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />

                    <Box sx={{ width: 110, textAlign: 'right' }}>
                      <IconButton
                        color="default"
                        onClick={() => {
                          openLink(`/pet/${item.memberPetId}`);
                        }}
                      >
                        <Iconify icon="solar:eye-bold" />
                      </IconButton>
                      <IconButton
                        color="default"
                        onClick={() => {
                          handleOpenPetEdit(item);
                        }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Box>
                  </Stack>
                ))}
              </>
            )}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}

      {/* PetQuickEditForm también usa useBoolean ahora */}
      <PetQuickEditForm
        currentUser={row}
        currentPet={petSelected}
        open={petQuickEdit.value}
        onClose={petQuickEdit.onFalse}
        refetch={refetch}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
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
    </>
  );
}
