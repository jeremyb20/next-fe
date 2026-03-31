import PetEditForm from '../../../_components/user-pet-edit-form';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Si no se encuentra nada
  return <PetEditForm petId={id} />;
}
