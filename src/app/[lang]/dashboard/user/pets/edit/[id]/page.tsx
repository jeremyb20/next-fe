import PetEditForm from '../../../_components/user-pet-edit-form';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  // Si no se encuentra nada
  return <PetEditForm petId={id} />;
}
