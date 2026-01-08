import { useState } from 'react';
import { useAuthContext } from '@/src/auth/hooks';
import { useCurrency } from '@/src/hooks/use-currency';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

import { IProductItem } from 'src/types/product';

import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

type Props = {
  product: IProductItem;
};

export default function ProductItem({ product }: Props) {
  const { onAddToCart } = useCheckoutContext();
  const [convertedPrice, setConvertedPrice] = useState<string>('');

  const {
    id,
    name,
    coverUrl,
    price,
    colors,
    available,
    sizes,
    priceSale,
    newLabel,
    saleLabel,
    productId,
    sellerName,
    sellerWhatsApp,
    country,
  } = product;

  const { authenticated } = useAuthContext();
  const { formatCurrency } = useCurrency();
  const linkTo = authenticated
    ? paths.dashboard.product.details(productId)
    : paths.product.details(productId);

  // useEffect(() => {
  //   const currency = countries.find((c) => c.label === country)?.currency || 'USD';
  //   convert(currency, price)
  //     .then((result) => {
  //       setConvertedPrice(result.convertedAmount);
  //     })
  //     .catch(() => {
  //       setConvertedPrice(fCurrency(price));
  //     });
  // }, [country, price]);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      coverUrl,
      available,
      price,
      colors: [colors[0]],
      size: sizes[0],
      quantity: 1,
      productId: Number(productId),
      sellerName,
      sellerWhatsApp,
      country,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
    >
      {newLabel.enabled && (
        <Label variant="filled" color="info">
          {newLabel.content}
        </Label>
      )}
      {saleLabel.enabled && (
        <Label variant="filled" color="error">
          {saleLabel.content}
        </Label>
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!available && 'Out of stock'} placement="bottom-end">
        <Image
          alt={name}
          src={coverUrl}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!available && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        noWrap
      >
        {name}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <ColorPreview colors={colors} />

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {priceSale && (
            <Box
              component="span"
              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
            >
              {formatCurrency(priceSale)}
            </Box>
          )}

          {/* <Box component="span">{fCurrency(price)}</Box> */}
          <Box component="span">{formatCurrency(price)}</Box>

          {/* <Box component="span">
            {convertedPrice || fCurrency(price)}
          </Box> */}
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}
