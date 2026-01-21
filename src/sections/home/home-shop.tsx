import { useState } from 'react';
import { isEqual } from 'lodash';
import { m } from 'framer-motion';
import orderBy from 'lodash/orderBy';
import { paths } from '@/src/routes/paths';
import { useTranslation } from 'react-i18next';
import EmptyContent from '@/src/components/empty-content';
import { useGetProductsPublished } from '@/src/api/product';
import { IProductItem, IProductFilters } from '@/src/types/product';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { varFade, MotionViewport } from 'src/components/animate';

import ProductList from '../product/product-list';

const defaultFilters: IProductFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 200],
};
// ----------------------------------------------------------------------
export default function HomeShop() {
  const { products, productsLoading, productsEmpty } =
    useGetProductsPublished();
  const [filters] = useState(defaultFilters);
  const [sortBy] = useState('newest');
  const router = useRouter();
  const { t } = useTranslation();

  const dataFiltered = applyFilter({
    inputData: products.slice(0, 4),
    filters,
    sortBy,
  });
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = !dataFiltered.length && canReset;

  const renderNotFound = (
    <EmptyContent filled title="No Data" sx={{ py: 10 }} />
  );
  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
      <Stack spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2"> {t('Affiliate Store')}</Typography>
        </m.div>
        <m.div variants={varFade().inUp}>
          <Typography variant="h6" color="text.secondary">
            {t('Exclusive discounts on products for your pet')}
          </Typography>
        </m.div>
      </Stack>

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <m.div variants={varFade().inUp}>
          {(notFound || productsEmpty) && renderNotFound}
          <ProductList products={dataFiltered} loading={productsLoading} />
        </m.div>
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <m.div variants={varFade().inUp}>
          <Button
            variant="outlined"
            onClick={() => router.push(paths.dashboard.product.root)}
            size="large"
          >
            {t('View All Offers')}
          </Button>
        </m.div>
      </Box>
    </Container>
  );
}

function applyFilter({
  inputData,
  filters,
  sortBy,
}: {
  inputData: IProductItem[];
  filters: IProductFilters;
  sortBy: string;
}) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === 'featured') {
    inputData = orderBy(inputData, ['totalSold'], ['desc']);
  }

  if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    inputData = orderBy(inputData, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    inputData = orderBy(inputData, ['price'], ['asc']);
  }

  // FILTERS
  if (gender.length) {
    inputData = inputData.filter((product) => gender.includes(product.gender));
  }

  if (category !== 'all') {
    inputData = inputData.filter((product) => product.category === category);
  }

  if (colors.length) {
    inputData = inputData.filter((product) =>
      product.colors.some((color) => colors.includes(color))
    );
  }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter(
      (product) => product.price >= min && product.price <= max
    );
  }

  if (rating) {
    inputData = inputData.filter((product) => {
      const convertRating = (value: string) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRatings > convertRating(rating);
    });
  }

  return inputData;
}
