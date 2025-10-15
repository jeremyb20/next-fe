// ----------------------------------------------------------------------

export const PRODUCT_GENDER_OPTIONS = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Animals', value: 'Animals' },
];

export const PRODUCT_CATEGORY_OPTIONS = ['Shose', 'Apparel', 'Accessories'];

export const PRODUCT_RATING_OPTIONS = [
  'up4Star',
  'up3Star',
  'up2Star',
  'up1Star',
];

export const PRODUCT_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const PRODUCT_COLOR_NAME_OPTIONS = [
  { value: '#FF4842', label: 'Red' }, // Rojo coral
  { value: '#1890FF', label: 'Blue' }, // Azul
  { value: '#00AB55', label: 'Green' }, // Verde esmeralda
  { value: '#FFC107', label: 'Yellow' }, // Amarillo ámbar
  { value: '#FFC0CB', label: 'Pink' }, // Rosa (en lugar de Violet)
  { value: '#94D82D', label: 'Lime' }, // Verde lima (en lugar de Cyan)
  { value: '#000000', label: 'Black' }, // Negro
  { value: '#FFFFFF', label: 'White' }, // Blanco
];

export const PRODUCT_SIZE_OPTIONS = [
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '8.5', label: '8.5' },
  { value: '9', label: '9' },
  { value: '9.5', label: '9.5' },
  { value: '10', label: '10' },
  { value: '10.5', label: '10.5' },
  { value: '11', label: '11' },
  { value: '11.5', label: '11.5' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
];

export const PRODUCT_STOCK_OPTIONS = [
  { value: 'in stock', label: 'In stock' },
  { value: 'low stock', label: 'Low stock' },
  { value: 'out of stock', label: 'Out of stock' },
];

export const PRODUCT_PUBLISH_OPTIONS = [
  {
    value: 'published',
    label: 'Published',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];

export const PRODUCT_SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High - Low' },
  { value: 'priceAsc', label: 'Price: Low - High' },
];

export const PRODUCT_CATEGORY_GROUP_OPTIONS = [
  {
    group: 'Clothing',
    classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather', 'Accessories'],
  },
  {
    group: 'Tailored',
    classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats', 'Apparel'],
  },
  {
    group: 'Accessories',
    classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'],
  },
  {
    group: 'Pets',
    classify: ['Food', 'Collars & leashes', 'Toys', 'Apparel & accessories'],
  },
];

export const PRODUCT_CHECKOUT_STEPS = ['Cart', 'Billing & address', 'Payment'];
