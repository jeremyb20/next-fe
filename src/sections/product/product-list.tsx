import { useCallback } from 'react';
import { IProductItem } from '@/types/product';
import { UserQueryParams } from '@/hooks/use-fetch-paginated';
import { ROWS_PER_PAGE_OPTIONS } from '@/components/filters/filter-constants';

import { TablePagination } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';

import ProductItem from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  products: IProductItem[];
  loading?: boolean;
  setActiveFilters: React.Dispatch<
    React.SetStateAction<Partial<UserQueryParams>>
  >;
  activeFilters: Partial<UserQueryParams>;
  pagination: {
    total: number;
    page: number;
    limit: number;
  } | null;
};

export default function ProductList({
  products,
  loading,
  setActiveFilters,
  activeFilters,
  pagination,
  ...other
}: Props) {
  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      const backendPage = newPage + 1;

      setActiveFilters((prev) => ({
        ...prev,
        page: backendPage, // Guardar en base 1 para el backend
      }));
    },
    [setActiveFilters]
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setActiveFilters((prev) => ({
        ...prev,
        limit: newRowsPerPage,
        page: 1,
      }));
    },
    [setActiveFilters]
  );

  const renderSkeleton = (
    <>
      {[...Array(10)].map(
        (
          _,
          index // 12 skeletons para 4x3 grid
        ) => (
          <ProductItemSkeleton key={index} />
        )
      )}
    </>
  );

  const renderList = (
    <>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={{
          xs: 1,
          sm: 3,
          md: 4,
          lg: 4,
        }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {pagination && pagination.total > 0 && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={(activeFilters.page || 1) - 1}
          rowsPerPage={activeFilters.limit || 12}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage="Products per page"
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        />
      )}
    </>
  );
}
