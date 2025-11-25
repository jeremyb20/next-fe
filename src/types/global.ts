import { IPetProfile } from './api';

export type OptionType = {
  label: string;
  value: string;
};

export interface PetAgeResult {
  years: number;
  months: number;
  humanYears: number;
  petYears: number;
  ageCategory: 'cachorro' | 'joven' | 'adulto' | 'senior';
  description: string;
}

export interface AgeCalculationOptions {
  species: 'dog' | 'cat';
  size?: 'small' | 'medium' | 'large'; // Solo para perros
  exactAge?: boolean; // Si se quiere cálculo exacto o estándar
}

export interface PetApiResponse {
  success: boolean;
  payload?: IPetProfile | null;
  qrCode?: QrCode;
  type: 'pet_profile' | 'qr_code_unregistered' | 'not_found';
  message?: string;
}

export interface QrCode {
  randomCode: string;
  assignedPet: any;
  createdAt: string;
}
