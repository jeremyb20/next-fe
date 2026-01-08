// Tasa de cambio (ejemplo: 1 USD = 600 CRC)
// En producción, esto debería venir de una API

export const DEFAULT_CURRENCY = 'CRC'; // Moneda base de los productos

// Función para obtener tasas de cambio actualizadas (puedes conectar a una API aquí)

export const EXCHANGE_RATES = {
  CRC: {
    USD: 0.002, // 1 CRC = 0.002 USD
    EUR: 0.0017, // 1 CRC = 0.0017 EUR
    CNY: 0.014, // 1 CRC = 0.014 CNY (aprox)
    VND: 48.5, // 1 CRC = 48.5 VND (aprox)
    AED: 0.0073, // 1 CRC = 0.0073 AED (aprox)
  },

  // Desde USD (Dólar Estadounidense)
  USD: {
    CRC: 497, // 1 USD = 497 CRC
    EUR: 0.86, // 1 USD = 0.86 EUR
    CNY: 7.0, // 1 USD = 7.0 CNY (aprox)
    VND: 24250, // 1 USD = 24,250 VND (aprox)
    AED: 3.67, // 1 USD = 3.67 AED (fijo)
  },

  // Desde EUR (Euro)
  EUR: {
    CRC: 579, // 1 EUR = 579 CRC
    USD: 1.16, // 1 EUR = 1.16 USD
    CNY: 8.12, // 1 EUR = 8.12 CNY (aprox)
    VND: 28150, // 1 EUR = 28,150 VND (aprox)
    AED: 4.26, // 1 EUR = 4.26 AED (aprox)
  },

  // Desde CNY (Yuan Chino)
  CNY: {
    CRC: 71.4, // 1 CNY = 71.4 CRC (aprox)
    USD: 0.143, // 1 CNY = 0.143 USD
    EUR: 0.123, // 1 CNY = 0.123 EUR
    VND: 3464, // 1 CNY = 3,464 VND (aprox)
    AED: 0.524, // 1 CNY = 0.524 AED (aprox)
  },

  // Desde VND (Đồng Vietnamita)
  VND: {
    CRC: 0.0206, // 1 VND = 0.0206 CRC
    USD: 0.000041, // 1 VND = 0.000041 USD
    EUR: 0.000036, // 1 VND = 0.000036 EUR
    CNY: 0.000288, // 1 VND = 0.000288 CNY
    AED: 0.000151, // 1 VND = 0.000151 AED
  },

  // Desde AED (Dirham de los EAU)
  AED: {
    CRC: 136.8, // 1 AED = 136.8 CRC
    USD: 0.272, // 1 AED = 0.272 USD
    EUR: 0.235, // 1 AED = 0.235 EUR
    CNY: 1.91, // 1 AED = 1.91 CNY
    VND: 6625, // 1 AED = 6,625 VND
  },
};

export const getExchangeRate = (from: string, to: string): number => {
  const fromRates = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES];
  if (!fromRates) return 1;
  return (fromRates as any)[to] || 1;
};
// Tipos para TypeScript
export type CurrencyCode = 'CRC' | 'USD' | 'EUR' | 'CNY' | 'VND' | 'AED';
