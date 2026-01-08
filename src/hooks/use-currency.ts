/* eslint-disable no-nested-ternary */
// src/hooks/useCurrency.ts

import { useLocales } from '../locales/use-locales';
import {
  getExchangeRate,
  DEFAULT_CURRENCY,
  type CurrencyCode,
} from '../utils/currency-service';

type InputValue = string | number;

interface CurrencyOptions {
  forceCurrency?: CurrencyCode;
  showOriginal?: boolean;
  maxFractionDigits?: number;
  minFractionDigits?: number;
}

export function useCurrency() {
  const { targetCurrency, exchangeRate, shouldConvert, currentLang } =
    useLocales();

  /**
   * Formatea un valor monetario según la moneda del idioma actual
   */
  const formatCurrency = (
    inputValue: InputValue,
    options?: CurrencyOptions
  ): string => {
    if (inputValue === '' || inputValue === null || inputValue === undefined) {
      return '';
    }

    const displayCurrency = options?.forceCurrency || targetCurrency;
    const displayExchangeRate = options?.forceCurrency
      ? getExchangeRate(DEFAULT_CURRENCY, options.forceCurrency)
      : exchangeRate;

    const displayShouldConvert = DEFAULT_CURRENCY !== displayCurrency;

    let displayValue: number;

    if (displayShouldConvert) {
      displayValue = Number(inputValue) * displayExchangeRate;
    } else {
      displayValue = Number(inputValue);
    }

    // Configurar dígitos decimales según la moneda
    const maxFractionDigits =
      options?.maxFractionDigits !== undefined
        ? options.maxFractionDigits
        : displayCurrency === 'CRC'
          ? 0
          : 2;

    const minFractionDigits =
      options?.minFractionDigits !== undefined ? options.minFractionDigits : 0;

    // Formatear el valor
    const formatted = new Intl.NumberFormat(
      options?.forceCurrency
        ? getLocaleForCurrency(options.forceCurrency)
        : currentLang.numberFormat?.code || 'en-US',
      {
        style: 'currency',
        currency: displayCurrency,
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits,
      }
    ).format(displayValue);

    // Opcional: mostrar también el valor original
    if (
      options?.showOriginal &&
      displayShouldConvert &&
      !options.forceCurrency
    ) {
      const originalValue = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: DEFAULT_CURRENCY,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(inputValue));

      return `${formatted} (${originalValue})`;
    }

    return formatted;
  };

  /**
   * Convierte un valor de CRC a la moneda objetivo
   */
  const convertValue = (inputValue: InputValue): number => {
    if (!inputValue) return 0;
    return Number(inputValue) * exchangeRate;
  };

  /**
   * Obtiene el valor convertido sin formatear
   */
  const getConvertedValue = (inputValue: InputValue): number => {
    if (!inputValue) return 0;
    return Number(inputValue) * exchangeRate;
  };

  /**
   * Formatea un número simple (sin símbolo de moneda)
   */
  const formatNumber = (
    inputValue: InputValue,
    options?: {
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    }
  ): string => {
    if (!inputValue) return '';

    return new Intl.NumberFormat(currentLang.numberFormat?.code || 'en-US', {
      minimumFractionDigits: options?.minimumFractionDigits || 0,
      maximumFractionDigits: options?.maximumFractionDigits || 2,
    }).format(Number(inputValue));
  };

  return {
    // Funciones principales
    formatCurrency,
    convertValue,
    getConvertedValue,
    formatNumber,

    // Información del contexto actual
    targetCurrency,
    shouldConvert,
    exchangeRate,
    currentLang,

    // Utilidades
    isDefaultCurrency: DEFAULT_CURRENCY === targetCurrency,
  };
}

// Helper para obtener locale basado en moneda
function getLocaleForCurrency(currency: CurrencyCode): string {
  const locales: Record<CurrencyCode, string> = {
    CRC: 'es-CR',
    USD: 'en-US',
    EUR: 'de-DE', // o 'fr-FR' dependiendo de tu preferencia
    CNY: 'zh-CN',
    VND: 'vi-VN',
    AED: 'ar-AE',
  };
  return locales[currency] || 'en-US';
}
