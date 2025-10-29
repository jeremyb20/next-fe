import parsePhoneNumberFromString, {
  CountryCode,
  isValidPhoneNumber,
} from 'libphonenumber-js';

import { countries } from '../assets/data';

export const simplePhoneValidation = (phone: string, context: any) => {
  const { country } = context.parent;

  if (!country || !phone) {
    return true; // Deja que las validaciones required de Yup manejen esto
  }

  const countryData = countries.find((c) => c.label === country);
  if (!countryData) return false;

  const countryCode = countryData.code as CountryCode;
  return isValidPhoneNumber(phone, countryCode);
};

// Función para obtener el placeholder del teléfono según el país
export const getPhonePlaceholder = (
  watchCountry: string,
  placeholder: string
) => {
  if (!watchCountry) return placeholder;

  const countryData = countries.find((c) => c.label === watchCountry);
  if (!countryData) return placeholder;

  const countryCode = countryData.code as CountryCode;

  // Ejemplos de formatos por país
  const examples: Record<string, string> = {
    US: '(555) 123-4567',
    MX: '55 1234 5678',
    ES: '612 345 678',
    FR: '6 12 34 56 78',
    GB: '07123 456789',
    BR: '(11) 91234-5678',
    AR: '11 2345-6789',
    CO: '301 1234567',
  };

  return examples[countryCode] || placeholder;
};

// Función para obtener el mensaje de ayuda
export const getPhoneHelperText = (
  watchCountry: string,
  watchPhone: string
) => {
  if (!watchCountry) return 'Select a country first';

  const countryData = countries.find((c) => c.label === watchCountry);
  if (!countryData) return 'Invalid country';

  const countryCode = countryData.code as CountryCode;
  const phoneValue = watchPhone;

  if (!phoneValue) return `Enter phone number for ${watchCountry}`;

  try {
    const phoneNumber = parsePhoneNumberFromString(phoneValue, countryCode);
    if (phoneNumber && isValidPhoneNumber(phoneValue, countryCode)) {
      return `✓ Valid ${watchCountry} number`;
    }
  } catch (error) {
    // Ignorar errores de parsing
  }

  return `Enter valid phone number for ${watchCountry}`;
};
