// Tasa de cambio (ejemplo: 1 USD = 600 CRC)
// En producción, esto debería venir de una API

export const DEFAULT_CURRENCY = 'CRC'; // Moneda base de los productos

// Función para obtener tasas de cambio actualizadas (puedes conectar a una API aquí)

export const EXCHANGE_RATES = {
  CRC: {
    USD: 0.002, // 1 CRC = 0.002 USD
    EUR: 0.0017, // 1 CRC = 0.0017 EUR
  },
  USD: {
    CRC: 497, // 1 USD = 497 CRC
    EUR: 0.86, // 1 USD = 0.86 EUR
  },
  EUR: {
    CRC: 579, // 1 EUR = 579 CRC
    USD: 1.16, // 1 EUR = 1.16 USD
  },
};

export const getExchangeRate = (from: string, to: string): number => {
  const fromRates = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES];
  if (!fromRates) return 1;
  return (fromRates as any)[to] || 1;
};
// Tipos para TypeScript
export type CurrencyCode = 'CRC' | 'USD' | 'EUR';
