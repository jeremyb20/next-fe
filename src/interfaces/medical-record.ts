export type MedicalRecordType = 'vaccine' | 'deworming' | 'medical_visit';

export interface IVaccineFormData {
  dateOfApplication: string;
  nextVaccineDate: string;
  vaccineName: string;
  observations: string;
  _id?: string;
}

export interface IDewormingFormData {
  dateOfApplication: string;
  nextDewormingDate: string;
  dewormerName: string;
  observations: string;
  _id?: string;
}

export interface IMedicalVisitFormData {
  visitDate: string;
  reasonForVisit: string;
  veterinarianName: string;
  observations: string;
  _id?: string;
}

// Tipo unión para FormValues
export type FormValues =
  | IVaccineFormData
  | IDewormingFormData
  | IMedicalVisitFormData;

// Tipo guard para verificar el tipo de registro
export const isVaccineRecord = (
  record: FormValues,
  type: MedicalRecordType
): record is IVaccineFormData => type === 'vaccine';

export const isDewormingRecord = (
  record: FormValues,
  type: MedicalRecordType
): record is IDewormingFormData => type === 'deworming';

export const isMedicalVisitRecord = (
  record: FormValues,
  type: MedicalRecordType
): record is IMedicalVisitFormData => type === 'medical_visit';
