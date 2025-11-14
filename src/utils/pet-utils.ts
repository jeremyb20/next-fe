import { BreedOptions } from '@/src/utils/constants';

/**
 * Determina la especie (dog o cat) basada en la raza seleccionada
 */
export function getSpeciesFromBreed(breedValue: string): 'dog' | 'cat' | null {
  if (!breedValue) return null;

  // Buscar en razas de perros
  const isDog = BreedOptions.perros.some((dog) => dog.value === breedValue);
  if (isDog) return 'dog';

  // Buscar en razas de gatos
  const isCat = BreedOptions.gatos.some((cat) => cat.value === breedValue);
  if (isCat) return 'cat';

  return null;
}

/**
 * Determina el tamaño del perro basado en la raza (solo para perros)
 */
export function getDogSizeFromBreed(
  breedValue: string
): 'small' | 'medium' | 'large' | null {
  if (!breedValue) return null;

  // Razas pequeñas (<10kg)
  const smallBreeds = [
    'chihuahua',
    'yorkshire_terrier',
    'pomerania',
    'shih_tzu',
    'maltes',
    'bichon_frise',
    'pug',
    'carlino',
    'jack_russell_terrier',
  ];

  // Razas grandes (>25kg)
  const largeBreeds = [
    'pastor_aleman',
    'labrador_retriever',
    'golden_retriever',
    'rottweiler',
    'doberman_pinscher',
    'gran_danes',
    'siberian_husky',
    'boxer',
    'akita',
    'san_bernardo',
    'mastin',
    'terranova',
    'pastor_belga',
  ];

  if (smallBreeds.includes(breedValue)) return 'small';
  if (largeBreeds.includes(breedValue)) return 'large';

  // Por defecto, considerar como mediano
  return 'medium';
}
