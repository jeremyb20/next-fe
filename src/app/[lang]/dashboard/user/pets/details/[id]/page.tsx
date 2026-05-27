import PetProfileView from '../../../_components/pet-profile-view';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;

  // Si no se encuentra nada
  return <PetProfileView petId={id} />;
}
