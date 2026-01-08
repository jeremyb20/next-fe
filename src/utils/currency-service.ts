// Tasa de cambio (ejemplo: 1 USD = 600 CRC)
// En producción, esto debería venir de una API

export const DEFAULT_CURRENCY = 'CRC'; // Moneda base de los productos

// Función para obtener tasas de cambio actualizadas (puedes conectar a una API aquí)

export const EXCHANGE_RATES = {
  CRC: {
    USD: 0.00167, // 1 CRC = 0.00167 USD
    EUR: 0.00152, // 1 CRC = 0.00152 EUR
  },
  USD: {
    CRC: 600, // 1 USD = 600 CRC
    EUR: 0.92, // 1 USD = 0.92 EUR
  },
  EUR: {
    CRC: 650, // 1 EUR = 650 CRC
    USD: 1.09, // 1 EUR = 1.09 USD
  },
};

export const getExchangeRate = (from: string, to: string): number => {
  const fromRates = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES];
  if (!fromRates) return 1;
  return (fromRates as any)[to] || 1;
};
// Tipos para TypeScript
export type CurrencyCode = 'CRC' | 'USD' | 'EUR';
