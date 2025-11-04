import { useState } from 'react';
import { MedicalRecordType } from '@/src/interfaces/medical-record';

export const useMedicalRecordForm = () => {
  const [open, setOpen] = useState(false);
  const [currentType, setCurrentType] = useState<MedicalRecordType>('vaccine');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [petId, setPetId] = useState<string>('');

  const openForm = (
    type: MedicalRecordType,
    selectedPetId: string,
    record?: any
  ) => {
    setCurrentType(type);
    setPetId(selectedPetId);
    setCurrentRecord(record || null);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setCurrentRecord(null);
    setPetId('');
  };

  const editRecord = (
    type: MedicalRecordType,
    record: any,
    selectedPetId: string
  ) => {
    openForm(type, selectedPetId, record);
  };

  const createRecord = (type: MedicalRecordType, selectedPetId: string) => {
    openForm(type, selectedPetId);
  };

  return {
    open,
    currentType,
    currentRecord,
    petId,
    openForm,
    closeForm,
    editRecord,
    createRecord,
  };
};
