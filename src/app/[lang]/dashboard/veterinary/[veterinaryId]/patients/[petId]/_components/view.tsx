'use client';

import { RoleBasedGuard } from '@/auth/guard';

import ClinicalRecordView from './clinical-record-view';

type Props = {
  veterinaryId: string;
  petId: string;
};

export default async function ClinicalRecordViewPage({
  veterinaryId,
  petId,
}: Props) {
  return (
    <RoleBasedGuard
      hasContent
      roles={['veterinarian', 'admin']}
      sx={{ py: 10 }}
    >
      <ClinicalRecordView veterinaryId={veterinaryId} petId={petId} />
    </RoleBasedGuard>
  );
}
