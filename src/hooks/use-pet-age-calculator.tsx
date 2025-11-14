import { useMemo, useState } from 'react';

import { PetAgeCalculator } from '../utils/pet-age-calculator';
import { PetAgeResult, AgeCalculationOptions } from '../types/global';

export function usePetAgeCalculator() {
  const [ageResult, setAgeResult] = useState<PetAgeResult | null>(null);

  const calculateAge = (birthDate: any, options: AgeCalculationOptions) => {
    try {
      const result = PetAgeCalculator.calculateAge(birthDate, options);
      setAgeResult(result);
      return result;
    } catch (error) {
      console.error('Error calculating pet age:', error);
      setAgeResult(null);
      throw error;
    }
  };

  const recommendations = useMemo(() => {
    if (!ageResult) return [];
    return PetAgeCalculator.getAgeRecommendations(ageResult);
  }, [ageResult]);

  return {
    ageResult,
    calculateAge,
    recommendations,
    reset: () => setAgeResult(null),
  };
}
