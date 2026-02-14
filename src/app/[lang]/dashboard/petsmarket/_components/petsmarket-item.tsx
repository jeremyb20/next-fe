import { IProductItem } from '@/src/types/product';
import { inventoryStatusOptions } from '@/src/utils/constants';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  tour: IProductItem;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function PetsMarketItem({
  tour,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const popover = usePopover();

  const {
    name,
    price,
    images,
    productId,
    inventoryType,
    createdAt,
    priceSale,
    quantity,
    ratings = [],
  } = tour;

  // const shortLabel = shortDateLabel(available.startDate, available.endDate);

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'grey.800',
        display: ratings.length > 0 ? 'flex' : 'none',
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: 'warning.main', mr: 0.25 }} />
      {ratings.length}
    </Stack>
  );

  const renderPrice = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: 'grey.800',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {!!priceSale && (
        <Box
          component="span"
          sx={{ color: 'grey.500', mr: 0.25, textDecoration: 'line-through' }}
        >
          {fCurrency(priceSale)}
        </Box>
      )}
      {fCurrency(price)}
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        {renderPrice}
        {renderRating}
        <Image
          alt={images?.[0]?.image_id}
          src={images?.[0]?.imageURL}
          sx={{ borderRadius: 1, height: 194, width: 1 }}
        />
      </Stack>
      <Stack spacing={0.5}>
        <Image
          alt={images?.[1]?.image_id}
          src={images?.[1]?.imageURL}
          ratio="1/1"
          sx={{ borderRadius: 1, width: 95 }}
        />
        <Image
          alt={images?.[2]?.image_id}
          src={images?.[2]?.imageURL}
          ratio="1/1"
          sx={{ borderRadius: 1, width: 95 }}
        />
      </Stack>
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`Posted date: ${fDateTime(createdAt)}`}
      secondary={
        <Link
          component={RouterLink}
          href={paths.dashboard.petsmarket.details(productId)}
          color="inherit"
        >
          {name}
        </Link>
      }
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      <IconButton
        onClick={popover.onOpen}
        sx={{ position: 'absolute', bottom: 20, right: 8 }}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      {[
        {
          label:
            inventoryStatusOptions.find(
              (option) => option.value === inventoryType
            )?.label || 'Unknown',
          icon: (
            <Iconify icon="solar:tag-bold" sx={{ color: 'success.main' }} />
          ),
        },
        {
          label: `${quantity} available`,
          icon: <Iconify icon="solar:box-bold" sx={{ color: 'info.main' }} />,
        },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}

        {renderTexts}

        {renderInfo}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
