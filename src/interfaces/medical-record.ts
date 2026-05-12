// interfaces/medical-record.ts
export type MedicalRecordType = 'vaccine' | 'deworming' | 'medical_visit';

// Interfaz base para notificaciones
export interface INotificationSettings {
  emailNotificationEnabled: boolean;
  notificationDaysBefore: number;
}

// Vacuna con notificaciones
export interface IVaccineFormData extends INotificationSettings {
  dateOfApplication: string;
  nextVaccineDate: string;
  vaccineName: string;
  observations: string;
  _id?: string;
}

// Desparasitación con notificaciones
export interface IDewormingFormData extends INotificationSettings {
  dateOfApplication: string;
  nextDewormingDate: string;
  dewormerName: string;
  observations: string;
  _id?: string;
}

// Visita médica con notificaciones
export interface IMedicalVisitFormData extends INotificationSettings {
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

// Helper para obtener valores por defecto de notificaciones
export const getDefaultNotificationSettings = (): INotificationSettings => ({
  emailNotificationEnabled: false,
  notificationDaysBefore: 7,
});