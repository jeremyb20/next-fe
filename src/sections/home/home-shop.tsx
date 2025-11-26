import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const PRODUCTS = [
  {
    name: 'Alimento Premium',
    price: '$45.99',
    originalPrice: '$55.99',
    discount: '18%',
    image:
      'https://http2.mlstatic.com/D_NQ_NP_2X_929959-MLA95842061207_102025-F.webp',
    store: 'PetShop Central',
  },
  {
    name: 'Juguete Interactivo',
    price: '$22.50',
    originalPrice: '$30.00',
    discount: '25%',
    image:
      'https://m.media-amazon.com/images/I/71WDlQPY9uL._AC_SY300_SX300_QL70_FMwebp_.jpg',
    store: 'Mundo Mascota',
  },
  {
    name: 'Cama Ortopédica',
    price: '$89.99',
    originalPrice: '$120.00',
    discount: '25%',
    image:
      'https://petformed.com/es/wp-content/uploads/sites/7/2024/04/Legowisko-Petformed-Niebieskie-2.jpg',
    store: 'Comfort Pets',
  },
];

export default function HomeShop() {
  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
      <Stack spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2">Tiendas Afiliadas</Typography>
        </m.div>
        <m.div variants={varFade().inUp}>
          <Typography variant="h6" color="text.secondary">
            Descuentos exclusivos en productos para tu mascota
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {PRODUCTS.map((product, index) => (
          <m.div key={product.name} variants={varFade().inUp}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows.z16,
                },
              }}
            >
              <Chip
                label={product.discount}
                color="error"
                size="small"
                sx={{ position: 'absolute', top: 16, right: 16 }}
              />

              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />

              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {product.store}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" color="primary.main">
                  {product.price}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.originalPrice}
                </Typography>
              </Stack>

              <Button variant="contained" fullWidth>
                Comprar Ahora
              </Button>
            </Card>
          </m.div>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <m.div variants={varFade().inUp}>
          <Button variant="outlined" size="large">
            Ver Todas las Ofertas
          </Button>
        </m.div>
      </Box>
    </Container>
  );
}
