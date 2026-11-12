import { Metadata } from 'next';

import ClinicalRecordViewPage from './_components/view';

export const metadata: Metadata = {
  title: 'Clinical Record',
};

type Props = {
  params: Promise<{
    veterinaryId: string;
    petId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { veterinaryId, petId } = await params;

  return <ClinicalRecordViewPage veterinaryId={veterinaryId} petId={petId} />;
}
