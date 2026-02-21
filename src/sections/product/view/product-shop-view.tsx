'use client';

import isEqual from 'lodash/isEqual';
import { paths } from '@/routes/paths';
import { useBoolean } from '@/hooks/use-boolean';
import { useSearchProducts } from '@/api/product';
import { useDebounce } from '@/hooks/use-debounce';
import EmptyContent from '@/components/empty-content';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useSettingsContext } from '@/components/settings';
import { useAuthContext } from '@/auth/hooks/use-auth-context';
import {
  IProductItem,
  IProductFilters,
  IProductFilterValue,
} from '@/types/product';
import {
  UserQueryParams,
  useGetAllPublishedProducts,
} from '@/hooks/use-fetch-paginated';
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from '@/_mock';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ProductList from '../product-list';
import ProductSort from '../product-sort';
import CartIcon from '../common/cart-icon';
import ProductSearch from '../product-search';
import ProductFilters from '../product-filters';
import { useCheckoutContext } from '../../checkout/context';
import ProductFiltersResult from '../product-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: IProductFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const { authenticated } = useAuthContext();
  const settings = useSettingsContext();
  const checkout = useCheckoutContext();
  const openFilters = useBoolean();
  const { t } = useTranslation();

  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);
  const [filters, setFilters] = useState(defaultFilters);

  // 🔥 Estado de paginación
  const [activeFilters, setActiveFilters] = useState<Partial<UserQueryParams>>({
    page: 1,
    limit: 10,
    sortBy: getSortByField('featured'),
    sortOrder: getSortOrder('featured'),
  });

  // Actualizar sort cuando cambia
  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      sortBy: getSortByField(sortBy),
      sortOrder: getSortOrder(sortBy),
      page: 1, // Reset a primera página al cambiar orden
    }));
  }, [sortBy]);

  // Reset a página 1 cuando cambian filtros
  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [filters]);

  const { data: products, isLoading: productsLoading } =
    useGetAllPublishedProducts(activeFilters);

  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  const handleFilters = useCallback(
    (name: string, value: IProductFilterValue) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // 🔥 Aplicar filtros adicionales del lado del cliente si es necesario
  const dataFiltered = applyFilter({
    inputData: products?.payload || [],
    filters,
    sortBy, // El sort ya viene del backend, esto es por si necesitas filtros extra
  });

  const canReset = !isEqual(defaultFilters, filters);
  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  // Funciones helper para mapear sort
  function getSortByField(sortValue: string): string {
    switch (sortValue) {
      case 'priceAsc':
      case 'priceDesc':
        return 'price';
      case 'newest':
        return 'createdAt';
      case 'featured':
        return 'totalSold';
      default:
        return 'createdAt';
    }
  }

  function getSortOrder(sortValue: string): 'asc' | 'desc' {
    switch (sortValue) {
      case 'priceAsc':
        return 'asc';
      case 'priceDesc':
      case 'newest':
      case 'featured':
        return 'desc';
      default:
        return 'desc';
    }
  }

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(productId: string) =>
          authenticated
            ? paths.dashboard.product.details(productId)
            : paths.product.details(productId)
        }
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={['all', ...PRODUCT_CATEGORY_OPTIONS]}
        />

        <ProductSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      canReset={canReset}
      onResetFilters={handleResetFilters}
      results={products?.pagination?.total || 0}
    />
  );

  const renderNotFound = (
    <EmptyContent filled title="No Data" sx={{ py: 10 }} />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {t('Pets Store')}
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}
        {canReset && renderResults}
      </Stack>

      {(notFound || products?.payload.length === 0) && renderNotFound}

      <ProductList
        products={dataFiltered}
        loading={productsLoading}
        setActiveFilters={setActiveFilters}
        activeFilters={activeFilters}
        pagination={products?.pagination || null}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

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

  // Nota: El sort ya viene del backend, este filtro es solo para filtros adicionales
  // que el backend no maneja (como colores, ratings, etc.)

  // FILTERS (solo los que no vienen del backend)
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
