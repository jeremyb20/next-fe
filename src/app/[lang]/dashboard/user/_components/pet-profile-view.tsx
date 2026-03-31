'use client';

import React from 'react';
import { useGetPetProfileById } from '@/hooks/use-fetch';
import PetProfileViewComponent from '@/app/[lang]/pet/_components/view/pet-profile-view-component';

interface Props {
  petId: string;
  canEdit?: boolean;
}

export default function PetProfileView({ petId, canEdit }: Props) {
  const { data: petProfile, isFetching } = useGetPetProfileById(petId);

  return (
    <PetProfileViewComponent
      petProfile={petProfile!}
      canEdit={canEdit}
      isLoading={isFetching}
      requireLocationConsent={false}
    />
  );
}
