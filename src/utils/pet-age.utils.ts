// utils/pet-age.utils.ts
import { PetAgeResult, } from '../types/global';
import { PetAgeCalculator } from './pet-age-calculator';

export type TranslateFunction = (key: string, options?: Record<string, any>) => string;
// Interfaz para los parámetros de cálculo
export interface CalculatePetAgeParams {
  birthDate: string | Date;
  breedValue?: string;
  t?: TranslateFunction
}

// Interfaz extendida del resultado con traducciones
export interface CalculatedPetAgeResult extends PetAgeResult {
  descriptionTranslated?: string;
  ageCategoryTranslated?: string;
  species: 'dog' | 'cat';
  size?: 'small' | 'medium' | 'large';
}

// Mapeo de razas por especie
const DOG_BREEDS = new Set([
  'labrador', 'pastor alemán', 'golden retriever', 'bulldog', 'beagle',
  'poodle', 'rottweiler', 'boxer', 'dálmata', 'chihuahua', 'husky',
  'shih tzu', 'yorkie', 'pomeranian', 'gran danés', 'doberman',
  'san bernardo', 'border collie', 'cocker spaniel', 'pitbull'
]);

const CAT_BREEDS = new Set([
  'persa', 'siames', 'maine coon', 'ragdoll', 'bengalí', 'bengali',
  'sphynx', 'británico', 'scottish fold', 'fold', 'abisinio',
  'birmano', 'siberiano', 'angora', 'egipcio'
]);

// Mapeo de tamaños por raza (perros)
const SMALL_DOG_BREEDS = new Set([
  'chihuahua', 'yorkie', 'yorkshire terrier', 'pomerania', 'pomeranian',
  'shih tzu', 'poodle toy', 'caniche toy', 'maltes', 'pekines',
  'cavalier king charles', 'bichon', 'bichon frise', 'carlino', 'pug',
  'jack russell', 'jack russell terrier', 'west highland white terrier',
  'bull terrier', 'french poodle', 'poodle', 'criollo_perro'
]);

const MEDIUM_DOG_BREEDS = new Set([
  'beagle', 'bulldog frances', 'bulldog ingles', 'bulldog', 'cocker spaniel',
  'border collie', 'samoyedo', 'schnauzer', 'shiba', 'corgi', 'basenji',
  'boston terrier', 'australian shepherd', 'pastor australiano',
  'pembroke welsh corgi', 'galgo', 'caniche', 'pastor de shetland'
]);

const LARGE_DOG_BREEDS = new Set([
  'labrador', 'labrador retriever', 'pastor aleman', 'golden retriever',
  'rottweiler', 'boxer', 'doberman', 'doberman pinscher', 'gran danes',
  'san bernardo', 'husky', 'siberian husky', 'pitbull', 'dalmatas',
  'akita', 'mastin', 'pastor belga', 'setter irlandes', 'bloodhound',
  'terranova', 'weimaraner', 'bull terrier'
]);

/**
 * Obtiene la especie según la raza
 */
export function getSpeciesFromBreed(breed: string): 'dog' | 'cat' | null {
  if (!breed) return null;

  const breedLower = breed.toLowerCase().trim();

  if (DOG_BREEDS.has(breedLower) || SMALL_DOG_BREEDS.has(breedLower) || MEDIUM_DOG_BREEDS.has(breedLower) || LARGE_DOG_BREEDS.has(breedLower)) {
    return 'dog';
  }


  if (CAT_BREEDS.has(breedLower)) {
    return 'cat';
  }

  // Buscar por coincidencia parcial
  if ([...DOG_BREEDS].some((b) => breedLower.includes(b) || b.includes(breedLower))) return 'dog';
  if ([...CAT_BREEDS].some((b) => breedLower.includes(b) || b.includes(breedLower))) return 'cat';

  return null;
}

/**
 * Obtiene el tamaño según la raza del perro
 */
export function getDogSizeFromBreed(breed: string): 'small' | 'medium' | 'large' | null {
  if (!breed) return null;

  const breedLower = breed.toLowerCase().trim();

  if (SMALL_DOG_BREEDS.has(breedLower)) {
    return 'small';
  }

  if (MEDIUM_DOG_BREEDS.has(breedLower)) {
    return 'medium';
  }

  if (LARGE_DOG_BREEDS.has(breedLower)) {
    return 'large';
  }

  // Buscar por coincidencia parcial
  if ([...SMALL_DOG_BREEDS].some((b) => breedLower.includes(b))) return 'small';
  if ([...MEDIUM_DOG_BREEDS].some((b) => breedLower.includes(b))) return 'medium';
  if ([...LARGE_DOG_BREEDS].some((b) => breedLower.includes(b))) return 'large';

  return null;
}

/**
 * Calcula la edad de una mascota
 */
export function calculatePetAge({
  birthDate,
  breedValue,
  t,
}: CalculatePetAgeParams): CalculatedPetAgeResult | null {
  if (!birthDate) {
    return null;
  }

  try {
    // Determinar especie basado en la raza
    let species: 'dog' | 'cat' = 'dog'; // valor por defecto
    let size: 'small' | 'medium' | 'large' | undefined;

    if (breedValue) {
      const detectedSpecies = getSpeciesFromBreed(breedValue);
      if (detectedSpecies) {
        species = detectedSpecies;

        // Solo determinar tamaño para perros
        if (detectedSpecies === 'dog') {
          size = getDogSizeFromBreed(breedValue) || undefined;
        }
      }
    }

    const result = PetAgeCalculator.calculateAge(birthDate, {
      species,
      size,
    });

    return {
      ...result,
      descriptionTranslated: t ? t(result.description) : result.description,
      ageCategoryTranslated: t ? t(result.ageCategory) : result.ageCategory,
      species,
      size,
    };
  } catch (error) {
    console.error('Error calculando edad:', error);
    return null;
  }
}

/**
 * Obtiene recomendaciones para la mascota
 */
export function getPetAgeRecommendations(ageResult: PetAgeResult): string[] {
  return PetAgeCalculator.getAgeRecommendations(ageResult);
}

/**
 * Valida si la fecha de nacimiento es válida
 */
export function isValidPetBirthDate(birthDate: string | Date): boolean {
  if (!birthDate) return false;

  const birth = new Date(birthDate);
  const today = new Date();
  const maxAgeYears = 30; // Máxima edad esperada para mascotas

  if (Number.isNaN(birth.getTime())) return false;
  if (birth > today) return false;

  const ageInYears = (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365);

  return ageInYears >= 0 && ageInYears <= maxAgeYears;
}

/**
 * Formatea la edad para mostrar
 */
export function formatPetAge(
  result: PetAgeResult | null | undefined,
  format: 'short' | 'long' | 'detailed' = 'long',
  t?: TranslateFunction
): string {
  // Si no hay resultado, retornar N/A o traducción
  if (!result) {
    return t ? t('common.not_available') : 'N/A';
  }

  const { years, months, petYears } = result;

  // Si no hay función de traducción, usar formato por defecto
  if (!t) {
    switch (format) {
      case 'short':
        return `${petYears} yrs`;
      case 'detailed':
        return `${years}y ${months}m (${petYears} pet yrs)`;
      default:
        if (years === 0 && months > 0) {
          return `${months} month${months !== 1 ? 's' : ''}`;
        }
        if (years > 0 && months === 0) {
          return `${years} year${years !== 1 ? 's' : ''}`;
        }
        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    }
  }

  // Usar traducciones
  switch (format) {
    case 'short':
      return t('{{years}} yrs', { years: petYears });

    case 'detailed':
      return t('{{years}}y {{months}}m ({{petYears}} pet yrs)', {
        years,
        months,
        petYears
      });

    default: // long
      if (years === 0 && months > 0) {
        return t('months_only', { count: months });
      }

      if (years > 0 && months === 0) {
        return t('years_only', { count: years });
      }

      return t('years_and_months', {
        years,
        months
      });
  }
}

/**
 * Obtiene el ícono según la categoría de edad
 */
export function getAgeCategoryIcon(ageCategory: string): string {
  switch (ageCategory) {
    case 'puppy':
      return '🐾';
    case 'young':
      return '🐕';
    case 'adult':
      return '🦮';
    case 'senior':
      return '🐕‍🦺';
    default:
      return '🐶';
  }
}

/**
 * Obtiene el color según la categoría de edad
 */
export function getAgeCategoryColor(ageCategory: string): string {
  switch (ageCategory) {
    case 'puppy':
      return '#4caf50';
    case 'young':
      return '#2196f3';
    case 'adult':
      return '#ff9800';
    case 'senior':
      return '#9e9e9e';
    default:
      return '#757575';
  }
}

/**
 * Agrupa mascotas por categoría de edad
 */
export function groupPetsByAgeCategory(pets: Array<{ ageResult?: PetAgeResult }>) {
  const groups = {
    puppy: [] as any[],
    young: [] as any[],
    adult: [] as any[],
    senior: [] as any[],
  };

  pets.forEach(pet => {
    const category = pet.ageResult?.ageCategory || 'adult';
    if (category in groups) {
      groups[category as keyof typeof groups].push(pet);
    }
  });

  return groups;
}