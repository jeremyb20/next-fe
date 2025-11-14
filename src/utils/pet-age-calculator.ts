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
        ageCategory = 'cachorro';
        description = 'Cachorro - Necesita cuidados especiales y socialización';
      } else if (totalHumanMonths < 24) {
        ageCategory = 'joven';
        description = 'Adulto joven - Muy activo y enérgico';
      } else if (totalHumanMonths < 84) {
        // 7 años
        ageCategory = 'adulto';
        description = 'Adulto - En su mejor etapa';
      } else {
        ageCategory = 'senior';
        description = 'Senior - Necesita cuidados geriátricos';
      }
    } else {
      // cat
      if (totalHumanMonths < 6) {
        ageCategory = 'cachorro';
        description = 'Gatito - En etapa de crecimiento y desarrollo';
      } else if (totalHumanMonths < 24) {
        ageCategory = 'joven';
        description = 'Gato joven - Muy juguetón y activo';
      } else if (totalHumanMonths < 96) {
        // 8 años
        ageCategory = 'adulto';
        description = 'Gato adulto - Comportamiento estable';
      } else {
        ageCategory = 'senior';
        description = 'Gato senior - Cuidados especiales recomendados';
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

    if (ageCategory === 'cachorro') {
      recommendations.push('Vacunación completa requerida');
      recommendations.push('Alimento para cachorros');
      recommendations.push('Socialización temprana');
      recommendations.push('Entrenamiento básico');
    } else if (ageCategory === 'joven') {
      recommendations.push('Ejercicio regular importante');
      recommendations.push('Alimento para adultos jóvenes');
      recommendations.push('Controles veterinarios anuales');
    } else if (ageCategory === 'adulto') {
      recommendations.push('Mantenimiento de peso ideal');
      recommendations.push('Ejercicio moderado diario');
      recommendations.push('Chequeos veterinarios cada 6-12 meses');
    } else {
      // senior
      recommendations.push('Chequeos geriátricos cada 6 meses');
      recommendations.push('Alimento senior especializado');
      recommendations.push('Monitoreo de articulaciones y movilidad');
      recommendations.push('Exámenes de sangre regulares');
    }

    // Recomendaciones específicas por especie
    if (species === 'dog') {
      if (petYears > 7) {
        recommendations.push('Evaluación dental regular');
      }
    } else {
      // cat
      if (petYears > 8) {
        recommendations.push('Monitoreo de función renal');
        recommendations.push('Control de peso cuidadoso');
      }
    }

    return recommendations;
  }
}
