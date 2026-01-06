'use client';

import { useState, useCallback } from 'react';
import { useAuthContext } from '@/src/auth/hooks';
import { IProductItem } from '@/src/types/product';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CartIcon from '../common/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import ProductDetailsReview from '../product-details-review';
import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  product?: IProductItem;
};

export default function ProductShopDetailsView({ id, product }: Props) {
  const settings = useSettingsContext();
  const checkout = useCheckoutContext();
  const [currentTab, setCurrentTab] = useState('description');
  const { authenticated } = useAuthContext();
  const [isLoading] = useState(!product);

  // Si el producto viene del server, no necesitamos cargarlo
  // Pero si necesitas refrescar datos, puedes usar esto:
  // useEffect(() => {
  //   if (!product) {
  //     // Lógica para cargar el producto si no vino del server
  //     // fetchProduct(id).then(...)
  //   }
  // }, [id, product]);

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title="Producto no encontrado"
      description="El producto que buscas no está disponible o ha sido removido."
      action={
        <Button
          component={RouterLink}
          href={paths.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Volver a productos
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = product && (
    <>
      <CustomBreadcrumbs
        links={[
          { name: 'Inicio', href: '/' },
          {
            name: 'Tienda',
            href: authenticated
              ? paths.dashboard.product.root
              : paths.product.root,
          },
          { name: product.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container mb={4} spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={product} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary
            product={product}
            items={checkout.items}
            onAddCart={checkout.onAddToCart}
            onGotoStep={checkout.onGotoStep}
          />
        </Grid>
      </Grid>

      {/* Descripción y Reviews */}
      <Card sx={{ mt: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          <Tab value="description" label="Descripción" />
          <Tab
            value="reviews"
            label={`Reseñas (${product.reviews?.length || 0})`}
          />
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={product.description} />
        )}

        {currentTab === 'reviews' && product.reviews && (
          <ProductDetailsReview
            ratings={product.ratings || 0}
            reviews={product.reviews}
            totalRatings={product.totalRatings || 0}
            totalReviews={product.totalReviews || 0}
          />
        )}
      </Card>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mt: 5,
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.totalItems} />

      {isLoading && renderSkeleton}
      {!product && !isLoading && renderError}
      {product && renderProduct}
    </Container>
  );
}
