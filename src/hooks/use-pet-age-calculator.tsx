// hooks/use-pet-age-calculator.ts
import { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import {
  calculatePetAge,
  CalculatedPetAgeResult,
  getPetAgeRecommendations,
} from '@/utils/pet-age.utils';

export function usePetAgeCalculator() {
  const { t } = useTranslation();
  const [ageResult, setAgeResult] = useState<CalculatedPetAgeResult | null>(
    null
  );
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const calculateAge = useCallback(
    (birthDate: string, breedValue?: string) => {
      const result = calculatePetAge({
        birthDate,
        breedValue,
        t, // Pasar la función de traducción
      });

      if (result) {
        setAgeResult(result);
        setRecommendations(getPetAgeRecommendations(result));
      } else {
        setAgeResult(null);
        setRecommendations([]);
      }

      return result;
    },
    [t]
  );

  const reset = useCallback(() => {
    setAgeResult(null);
    setRecommendations([]);
  }, []);

  return {
    ageResult,
    recommendations,
    calculateAge,
    reset,
  };
}
