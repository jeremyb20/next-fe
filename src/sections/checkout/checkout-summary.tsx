import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from '@/components/iconify';
import { useCurrency } from '@/hooks/use-currency';
import { useTranslation } from '@/hooks/use-translation';

// ----------------------------------------------------------------------

type Props = {
  total: number;
  discount?: number;
  subTotal: number;
  shipping?: number;
  //
  onEdit?: VoidFunction;
  onApplyDiscount?: (discount: number) => void;
};

export default function CheckoutSummary({
  total,
  discount,
  subTotal,
  shipping,
  //
  onEdit,
  onApplyDiscount,
}: Props) {
  const { t } = useTranslation();
  const displayShipping = shipping !== null ? t('Free') : '-';
  const { formatCurrency } = useCurrency();

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={t('Order Summary')}
        action={
          onEdit && (
            <Button
              size="small"
              onClick={onEdit}
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              {t('Edit')}
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Sub Total')}
            </Typography>
            <Typography variant="subtitle2">
              {formatCurrency(subTotal)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Discount')}
            </Typography>
            <Typography variant="subtitle2">
              {discount ? formatCurrency(-discount) : '-'}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Shipping')}
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? formatCurrency(shipping) : displayShipping}
            </Typography>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">{t('Total')}</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {formatCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                ({t('VAT included if applicable')})
              </Typography>
            </Box>
          </Stack>

          {onApplyDiscount && (
            <TextField
              fullWidth
              placeholder={t('Discount codes / Gifts')}
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      color="primary"
                      onClick={() => onApplyDiscount(5)}
                      sx={{ mr: -0.5 }}
                    >
                      {t('Apply')}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
