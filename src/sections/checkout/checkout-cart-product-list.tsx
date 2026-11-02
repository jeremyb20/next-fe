import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from '@/components/scrollbar';
import { ICheckoutItem } from '@/types/checkout';
import { TableHeadCustom } from '@/components/table';
import { useTranslation } from '@/hooks/use-translation';

import CheckoutCartProduct from './checkout-cart-product';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  products: ICheckoutItem[];
  onDelete: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
};

export default function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  const { t } = useTranslation();

  const TABLE_HEAD = [
    { id: 'product', label: t('Product') },
    { id: 'price', label: t('Price') },
    { id: 'quantity', label: t('Quantity') },
    { id: 'totalAmount', label: t('Total Price'), align: 'right' },
    { id: '' },
  ];

  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                onDelete={() => onDelete(row.id)}
                onDecrease={() => onDecreaseQuantity(row.id)}
                onIncrease={() => onIncreaseQuantity(row.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
