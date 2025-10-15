/* eslint-disable no-nested-ternary */
// import { IOrderItem } from 'src/types/order';
import { IUser } from '@/src/types/api';
import { useTranslation } from 'react-i18next';
import { getUserRoleFromState } from '@/src/utils/constants';
import { STATUS_OPTIONS } from '@/src/components/filters/filter-constants';
import { AvatarWithSkeleton } from '@/src/components/avatar/avatar-with-skeleton';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IUser;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { pets, createdAt, userStatus, email, id, updatedAt, role } = row;

  const confirm = useBoolean();

  const { t } = useTranslation();

  const collapse = useBoolean();

  const popover = usePopover();

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
          primary={id}
          secondary={email}
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

      <TableCell sx={{ textTransform: 'capitalize' }}>
        {getUserRoleFromState(role)}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={(userStatus.toString() === '2' && 'success') || 'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {userStatus &&
            t(
              STATUS_OPTIONS.find(
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
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {pets && pets.length > 0 && (
              <>
                {pets.map((item, index) => (
                  <Stack
                    key={item.idParental + index}
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
                        secondary={item.ownerPetName || 'N/A'}
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
                      primary="Identification Active"
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

                    {/* <Box sx={{ width: 110, textAlign: 'right' }}> 
                      holi
                    </Box> */}
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
