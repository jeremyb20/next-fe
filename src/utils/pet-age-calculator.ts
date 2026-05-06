/* eslint-disable no-lonely-if */
import { PetAgeResult, AgeCalculationOptions } from '../types/global';

/**
 * Calcula la edad de una mascota en años de mascota
 * Basado en fórmulas veterinarias estándar
 */
export class PetAgeCalculator {
  /**
   * Calcula la edad de un perro en años perro
   */
  private static calculateDogAge(
    humanYears: number,
    humanMonths: number,
    size?: 'small' | 'medium' | 'large'
  ): PetAgeResult {
    const totalMonths = humanYears * 12 + humanMonths;
    let petYears: number;

    // Fórmula mejorada basada en estudios recientes
    if (totalMonths <= 12) {
      // Primer año - crecimiento rápido
      petYears = (totalMonths * 15) / 12;
    } else if (totalMonths <= 24) {
      // Segundo año
      petYears = 15 + ((totalMonths - 12) * 9) / 12;
    } else {
      // Años siguientes - varía por tamaño
      const baseAge = 24;
      let agingRate: number;

      switch (size) {
        case 'small': // Razas pequeñas (<10kg)
          agingRate = 4;
          break;
        case 'medium': // Razas medianas (10-25kg)
          agingRate = 5;
          break;
        case 'large': // Razas grandes (>25kg)
          agingRate = 6;
          break;
        default:
          agingRate = 5; // Default medium
      }

      petYears = baseAge + ((totalMonths - 24) * agingRate) / 12;
    }

    return this.getAgeResult(humanYears, humanMonths, petYears, 'dog');
  }

  /**
   * Calcula la edad de un gato en años gato
   */
  private static calculateCatAge(
    humanYears: number,
    humanMonths: number
  ): PetAgeResult {
    const totalMonths = humanYears * 12 + humanMonths;
    let petYears: number;

    if (totalMonths <= 12) {
      // Primer año - crecimiento muy rápido
      petYears = (totalMonths * 15) / 12;
    } else if (totalMonths <= 24) {
      // Segundo año
      petYears = 15 + ((totalMonths - 12) * 9) / 12;
    } else {
      // Años siguientes - envejecimiento más lineal
      petYears = 24 + ((totalMonths - 24) * 4) / 12;
    }

    return this.getAgeResult(humanYears, humanMonths, petYears, 'cat');
  }

  /**
   * Determina la categoría de edad y descripción
   */
  private static getAgeResult(
    humanYears: number,
    humanMonths: number,
    petYears: number,
    species: 'dog' | 'cat'
  ): PetAgeResult {
    const totalHumanMonths = humanYears * 12 + humanMonths;
    let ageCategory: PetAgeResult['ageCategory'];
    let description: string;

    if (species === 'dog') {
      if (totalHumanMonths < 6) {
        ageCategory = 'puppy';
        description = 'Puppy - Needs special care and socialization';
      } else if (totalHumanMonths < 24) {
        ageCategory = 'young';
        description = 'Young adult - Very active and energetic';
      } else if (totalHumanMonths < 84) {
        // 7 años
        ageCategory = 'adult';
        description = 'Adult - In the prime of life';
      } else {
        ageCategory = 'senior';
        description = 'Senior - Needs geriatric care';
      }
    } else {
      // cat
      if (totalHumanMonths < 6) {
        ageCategory = 'puppy';
        description = 'Kitten - In the growth and development stage';
      } else if (totalHumanMonths < 24) {
        ageCategory = 'young';
        description = 'Young cat - Very playful and active';
      } else if (totalHumanMonths < 96) {
        // 8 años
        ageCategory = 'adult';
        description = 'Adult cat - Stable behavior';
      } else {
        ageCategory = 'senior';
        description = 'Senior Cats - Recommended Special Care';
      }
    }

    return {
      years: humanYears,
      months: humanMonths,
      humanYears: Math.round((totalHumanMonths / 12) * 10) / 10,
      petYears: Math.round(petYears * 10) / 10,
      ageCategory,
      description,
    };
  }

  /**
   * Método principal para calcular la edad de la mascota
   */
  static calculateAge(
    birthDate: Date | string,
    options: AgeCalculationOptions
  ): PetAgeResult {
    const birth = new Date(birthDate);
    const now = new Date();

    // Validar fecha
    if (birth > now) {
      throw new Error('La fecha de nacimiento no puede ser en el futuro');
    }

    // Calcular diferencia en meses
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += now.getMonth();

    // Ajustar por días
    if (now.getDate() < birth.getDate()) {
      // eslint-disable-next-line no-plusplus
      months--;
    }

    const humanYears = Math.floor(months / 12);
    const humanMonths = months % 12;

    // Calcular según especie
    if (options.species === 'dog') {
      return this.calculateDogAge(humanYears, humanMonths, options.size);
    }
    return this.calculateCatAge(humanYears, humanMonths);
  }

  /**
   * Calcula la edad a partir de años y meses directamente
   */
  static calculateFromAge(
    years: number,
    months: number,
    options: AgeCalculationOptions
  ): PetAgeResult {
    if (options.species === 'dog') {
      return this.calculateDogAge(years, months, options.size);
    }
    return this.calculateCatAge(years, months);
  }

  /**
   * Obtiene recomendaciones basadas en la edad
   */
  static getAgeRecommendations(ageResult: any): string[] {
    const recommendations: string[] = [];
    const { ageCategory, petYears, species } = ageResult;

    if (ageCategory === 'puppy') {
      recommendations.push('Full vaccination required');
      recommendations.push('Puppy food');
      recommendations.push('Early socialization');
      recommendations.push('Basic training');
    } else if (ageCategory === 'young') {
      recommendations.push('Regular exercise is important');
      recommendations.push('Food for young adults');
      recommendations.push('Annual veterinary checkups');
    } else if (ageCategory === 'adult') {
      recommendations.push('Maintaining a healthy weight');
      recommendations.push('Moderate daily exercise');
      recommendations.push('Veterinary checkups every 6–12 months');
    } else {
      // senior
      recommendations.push('Geriatric checkups every 6 months');
      recommendations.push('Specialized senior food');
      recommendations.push('Joint and Mobility Monitoring');
      recommendations.push('Regular blood tests');
    }

    // Recomendaciones específicas por especie
    if (species === 'dog') {
      if (petYears > 7) {
        recommendations.push('Regular dental checkup');
      }
    } else {
      // cat
      if (petYears > 8) {
        recommendations.push('Monitoring of kidney function');
        recommendations.push('Control de peso cuidadoso');
      }
    }

    return recommendations;
  }
}


export const calculateAnimalAge = (birthDate: string, t?: (key: string) => string) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  return 'Less than 1 month';
};