import { paths } from '@/src/routes/paths';
import { useCurrency } from '@/src/hooks/use-currency';
import { inventoryStatusOptions } from '@/src/utils/constants';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { useRouter } from 'src/routes/hooks';

import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  const { formatCurrency } = useCurrency();

  return (
    <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
      {params.row.price && (
        <Box
          component="span"
          sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
        >
          {formatCurrency(params.row.price)}
        </Box>
      )}

      <Box component="span">{formatCurrency(params.row.priceSale)}</Box>
    </Stack>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label
      variant="soft"
      color={(params.row.publish === 'published' && 'info') || 'default'}
    >
      {params.row.publish}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fDate(params.row.createdAt)}
      secondary={fTime(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out_of_stock' && 'error') ||
          (params.row.inventoryType === 'low_stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available}{' '}
      {inventoryStatusOptions.find(
        (option) => option.value === params.row.inventoryType
      )?.label || 'Unknown'}
    </Stack>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
  const router = useRouter();

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={() => {
              router.push(
                paths.dashboard.admin.product.details(params.row.productId)
              );
            }}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box
            component="div"
            sx={{ typography: 'body2', color: 'text.disabled' }}
          >
            {params.row.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
