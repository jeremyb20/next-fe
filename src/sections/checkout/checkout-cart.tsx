import { paths } from '@/routes/paths';
import { countries } from '@//assets/data';
import Iconify from '@/components/iconify';
import { useAuthContext } from '@//auth/hooks';
import { RouterLink } from '@/routes/components';
import { fCurrency } from '@//utils/format-number';
import EmptyContent from '@/components/empty-content';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();

  const empty = !checkout.items.length;

  const { authenticated } = useAuthContext();

  // Obtener información del vendedor (asumiendo que todos los productos son del mismo vendedor)
  const getSellerInfo = () => {
    if (checkout.items.length === 0) return null;

    const firstItem = checkout.items[0];
    const sellerName = firstItem.sellerName || 'Vendedor';
    const { sellerWhatsApp } = firstItem;
    const sellerCountry = firstItem.country || 'Costa Rica';

    // Encontrar el código telefónico del país
    const countryCode =
      countries.find((country) => country.label === sellerCountry)?.phone ||
      '506'; // Costa Rica por defecto

    return {
      sellerName,
      sellerPhone: sellerWhatsApp ? `+${countryCode}${sellerWhatsApp}` : null,
      sellerCountry,
      countryCode,
    };
  };

  // Generar mensaje completo de WhatsApp con todos los productos
  const generateWhatsAppMessage = () => {
    const sellerInfo = getSellerInfo();

    if (!sellerInfo || !sellerInfo.sellerPhone) {
      console.warn('No hay información del vendedor o número de WhatsApp');
      return null;
    }

    // Mensaje base
    let message = `*PEDIDO DE PRODUCTOS - ${sellerInfo.sellerName.toUpperCase()}*\n\n`;
    message += `*Fecha:* ${new Date().toLocaleDateString()}\n`;
    message += `*Cliente:* ${
      authenticated ? 'Usuario registrado' : 'Cliente nuevo'
    }\n\n`;

    // Lista completa de productos
    message += `*PRODUCTOS SELECCIONADOS:*\n`;
    message += `══════════════════════════════════════\n\n`;

    checkout.items.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `    ID: ${item.productId || item.id}\n`;
      message += `    Precio unitario: ${fCurrency(item.priceSale)}\n`;

      // Información de especificaciones seleccionadas
      if (item.size) {
        message += `    Tamaño: ${item.size}\n`;
      }

      if (item.colors && item.colors.length > 0) {
        message += `    Color: ${item.colors[0]}\n`;
      }

      message += `    Cantidad: ${item.quantity}\n`;
      message += `    Subtotal: ${fCurrency(item.priceSale * item.quantity)}\n`;

      // Separador entre productos
      if (index < checkout.items.length - 1) {
        message += `   ──────────────────────────────\n\n`;
      }
    });

    message += `══════════════════════════════════════\n\n`;

    // Resumen general del pedido
    message += `*RESUMEN DEL PEDIDO*\n`;
    message += `• Total de productos: ${checkout.totalItems}\n`;
    message += `• Subtotal: ${fCurrency(checkout.subTotal)}\n`;

    if (checkout.discount > 0) {
      message += `• Descuento aplicado: -${fCurrency(checkout.discount)}\n`;
    }

    message += `• *TOTAL A PAGAR: ${fCurrency(checkout.total)}*\n\n`;

    // Pregunta final personalizada
    message += `*CONSULTA:*\n`;
    message += `¿Podrías confirmarme la disponibilidad de todos estos productos con las especificaciones indicadas?\n\n`;

    message += `Espero tu respuesta para coordinar el pago y envío. ¡Gracias!`;

    return {
      sellerPhone: sellerInfo.sellerPhone,
      message,
    };
  };

  // Función para abrir WhatsApp con el mensaje completo
  const handleWhatsAppOrder = () => {
    const messageData = generateWhatsAppMessage();

    if (!messageData) {
      alert(
        'No se pudo obtener la información del vendedor. Por favor, verifica que los productos tengan información de contacto.'
      );
      return;
    }

    const { sellerPhone, message } = messageData;
    const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  // Versión alternativa: si los productos tienen diferentes vendedores
  // const handleWhatsAppOrderMultipleSellers = () => {
  //   // Agrupar productos por vendedor (por si acaso)
  //   const sellerGroups: Record<string, any[]> = {};

  //   checkout.items.forEach((item) => {
  //     const sellerId = item.productId || 'default';

  //     if (!sellerGroups[sellerId]) {
  //       sellerGroups[sellerId] = [];
  //     }

  //     sellerGroups[sellerId].push(item);
  //   });

  //   // Si hay más de un vendedor, mostrar advertencia
  //   const sellerCount = Object.keys(sellerGroups).length;

  //   if (sellerCount > 1) {
  //     const confirmMessage = `Has seleccionado productos de ${sellerCount} vendedores diferentes. Se abrirán ${sellerCount} conversaciones de WhatsApp. ¿Deseas continuar?`;

  //     if (!window.confirm(confirmMessage)) {
  //       return;
  //     }

  //     // Abrir conversación para cada vendedor
  //     Object.entries(sellerGroups).forEach(([sellerId, products], index) => {
  //       const firstProduct = products[0];
  //       const sellerName = firstProduct.sellerName || `Vendedor ${index + 1}`;
  //       const { sellerWhatsApp } = firstProduct;
  //       const sellerCountry = firstProduct.country || 'Costa Rica';

  //       const countryCode =
  //         countries.find((country) => country.label === sellerCountry)?.phone ||
  //         '506';

  //       if (sellerWhatsApp) {
  //         const sellerPhone = `+${countryCode}${sellerWhatsApp}`;

  //         // Generar mensaje para este vendedor específico
  //         let message = `*PEDIDO PARA ${sellerName.toUpperCase()}*\n\n`;
  //         message += `*Fecha:* ${new Date().toLocaleDateString()}\n`;
  //         message += `*Cliente:* ${
  //           authenticated ? 'Usuario registrado' : 'Cliente nuevo'
  //         }\n\n`;

  //         message += `*Productos solicitados:*\n`;
  //         message += `══════════════════════════════════\n\n`;

  //         products.forEach((product, productIndex) => {
  //           message += `*${productIndex + 1}. ${product.name}*\n`;
  //           message += `   📋 ID: ${product.productId || product.id}\n`;
  //           message += `   💰 Precio: ${fCurrency(product.price)}\n`;
  //           message += `   🛒 Cantidad: ${product.quantity}\n`;
  //           message += `   📏 Tamaño: ${product.size || 'N/A'}\n`;
  //           message += `   💵 Subtotal: ${fCurrency(
  //             product.price * product.quantity
  //           )}\n\n`;
  //         });

  //         const sellerSubtotal = products.reduce(
  //           (sum, product) => sum + product.price * product.quantity,
  //           0
  //         );

  //         message += `*RESUMEN:*\n`;
  //         message += `• Productos: ${products.length}\n`;
  //         message += `• *Total: ${fCurrency(sellerSubtotal)}*\n\n`;

  //         message += `¿Podrías confirmar la disponibilidad?`;

  //         const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(
  //           message
  //         )}`;

  //         // Abrir con un pequeño delay para evitar bloqueos del navegador
  //         setTimeout(() => {
  //           window.open(whatsappUrl, '_blank');
  //         }, index * 500); // 500ms de delay entre cada ventana
  //       }
  //     });
  //   } else {
  //     // Solo un vendedor, usar la función simple
  //     handleWhatsAppOrder();
  //   }
  // };

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Carrito de Compras
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.totalItems}{' '}
                  {checkout.totalItems === 1 ? 'producto' : 'productos'})
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="¡Carrito Vacío!"
              description="No tienes productos en tu carrito de compras."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={checkout.items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={
            authenticated ? paths.dashboard.product.root : paths.product.root
          }
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{ mb: 2 }}
        >
          Seguir Comprando
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        {/* Botón de WhatsApp para contacto directo */}
        <Button
          fullWidth
          size="large"
          color="success"
          variant="contained"
          disabled={empty}
          startIcon={<Iconify icon="ic:baseline-whatsapp" width={24} />}
          onClick={handleWhatsAppOrder} // Usa handleWhatsAppOrderMultipleSellers si quieres manejar múltiples vendedores
          sx={{
            backgroundColor: '#25D366',
            '&:hover': {
              backgroundColor: '#1DA851',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            },
            '&.Mui-disabled': {
              backgroundColor: '#cccccc',
              color: '#666666',
            },
            fontWeight: 'bold',
            fontSize: '16px',
            py: 1.5,
            mb: 1,
          }}
        >
          Consultar Pedido por WhatsApp
        </Button>

        {/* Botón de pago normal (opcional, puedes mantenerlo comentado) */}
        {/*
        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={empty}
          onClick={checkout.onNextStep}
          sx={{ mb: 2 }}
        >
          Proceder al Pago Online
        </Button>
        */}
      </Grid>
    </Grid>
  );
}
