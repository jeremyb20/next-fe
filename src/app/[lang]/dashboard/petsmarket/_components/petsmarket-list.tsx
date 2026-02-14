import { useCallback } from 'react';
import { IProductItem } from '@/src/types/product';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import PetsMarketItem from './petsmarket-item';

// ----------------------------------------------------------------------

type Props = {
  listMarket: IProductItem[];
};

export default function PetsMarketList({ listMarket }: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (productId: string) => {
      router.push(paths.dashboard.petsmarket.details(productId));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.tour.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id: string) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {listMarket.map((list) => (
          <PetsMarketItem
            key={list.id}
            tour={list}
            onView={() => handleView(list.productId)}
            onEdit={() => handleEdit(list.productId)}
            onDelete={() => handleDelete(list.id)}
          />
        ))}
      </Box>

      {listMarket.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
