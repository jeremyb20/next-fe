export const getUserRoleFromState = (userState: number): string => {
  const roleMap: { [key: number]: string } = {
    0: 'admin',
    1: 'veterinarian',
    2: 'groomer',
    3: 'client',
  };

  return roleMap[userState] || 'user'; // Valor por defecto 'user' si no encuentra el estado
};

export const getUserStatusFromState = (userState: number): string => {
  const roleMap: { [key: number]: string } = {
    0: 'active',
    1: 'pending',
    2: 'banned',
    3: 'rejected',
  };

  return roleMap[userState] || 'active'; // Valor por defecto 'user' si no encuentra el estado
};

export const openLink = (linkRedirect: string) => {
  window.open(linkRedirect, '_blank');
};

export const parseWeight = (weightString: string | undefined) => {
  if (!weightString) return { value: '', unit: 'kg' };

  const match = weightString.match(/^([\d.]+)\s*(kg|lb)?$/i);
  if (match) {
    return {
      value: match[1],
      unit: (match[2]?.toLowerCase() as 'kg' | 'lb') || 'kg',
    };
  }
  return { value: '', unit: 'kg' };
};

export const BreedDogsOptions = [
  { value: '', label: 'Selecciona una raza' },
  { label: 'Criollo', value: 'criollo_perro' },
  { label: 'Labrador Retriever', value: 'labrador_retriever' },
  { label: 'Pastor Alemán', value: 'pastor_aleman' },
  { label: 'Golden Retriever', value: 'golden_retriever' },
  { label: 'Bulldog Francés', value: 'bulldog_frances' },
  { label: 'Bulldog Inglés', value: 'bulldog_ingles' },
  { label: 'Beagle', value: 'beagle' },
  { label: 'Poodle', value: 'poodle' },
  { label: 'French Poodle', value: 'French_poodle' },
  { label: 'Chow Chow', value: 'chow_chow' },
  { label: 'Rottweiler', value: 'rottweiler' },
  { label: 'Yorkshire Terrier', value: 'yorkshire_terrier' },
  { label: 'Boxer', value: 'boxer' },
  { label: 'Dachshund', value: 'dachshund' },
  { label: 'Siberian Husky', value: 'siberian_husky' },
  { label: 'Doberman Pinscher', value: 'doberman_pinscher' },
  { label: 'Gran Danés', value: 'gran_danes' },
  { label: 'Border Collie', value: 'border_collie' },
  { label: 'Chihuahua', value: 'chihuahua' },
  { label: 'Shih Tzu', value: 'shih_tzu' },
  { label: 'Boston Terrier', value: 'boston_terrier' },
  { label: 'Pembroke Welsh Corgi', value: 'pembroke_welsh_corgi' },
  { label: 'Australian Shepherd', value: 'australian_shepherd' },
  { label: 'Cocker Spaniel', value: 'cocker_spaniel' },
  { label: 'Pug', value: 'pug' },
  { label: 'Husky Siberiano', value: 'husky_siberiano' },
  { label: 'Akita', value: 'akita' },
  { label: 'San Bernardo', value: 'san_bernardo' },
  { label: 'Maltés', value: 'maltes' },
  { label: 'Basset Hound', value: 'basset_hound' },
  { label: 'Mastín', value: 'mastin' },
  { label: 'Pastor Australiano', value: 'pastor_australiano' },
  { label: 'Schnauzer', value: 'schnauzer' },
  { label: 'Weimaraner', value: 'weimaraner' },
  { label: 'Carlino', value: 'carlino' },
  { label: 'Bichón Frisé', value: 'bichon_frise' },
  { label: 'Bull Terrier', value: 'bull_terrier' },
  { label: 'Pastor Belga', value: 'pastor_belga' },
  { label: 'Shar Pei', value: 'shar_pei' },
  { label: 'Setter Irlandés', value: 'setter_irlandes' },
  { label: 'Bloodhound', value: 'bloodhound' },
  { label: 'Terranova', value: 'terranova' },
  { label: 'Galgo', value: 'galgo' },
  { label: 'Samoyedo', value: 'samoyedo' },
  { label: 'Pomerania', value: 'pomerania' },
  { label: 'Caniche', value: 'caniche' },
  { label: 'Pastor de Shetland', value: 'pastor_de_shetland' },
  {
    label: 'West Highland White Terrier',
    value: 'west_highland_white_terrier',
  },
  { label: 'Jack Russell Terrier', value: 'jack_russell_terrier' },
];

export const BreedCatsOptions = [
  { label: 'Criollo', value: 'criollo_gato' },
  { label: 'Siamés', value: 'siames' },
  { label: 'Persa', value: 'persa' },
  { label: 'Maine Coon', value: 'maine_coon' },
  { label: 'Bengalí', value: 'bengali' },
  { label: 'Ragdoll', value: 'ragdoll' },
  { label: 'British Shorthair', value: 'british_shorthair' },
  { label: 'Sphynx', value: 'sphynx' },
  { label: 'Abisinio', value: 'abisinio' },
  { label: 'Birmano', value: 'birmano' },
  { label: 'Azul Ruso', value: 'azul_ruso' },
  { label: 'Noruego del Bosque', value: 'noruego_del_bosque' },
  { label: 'Scottish Fold', value: 'scottish_fold' },
  { label: 'Exótico de Pelo Corto', value: 'exotico_de_pelo_corto' },
  { label: 'Angora Turco', value: 'angora_turco' },
  { label: 'Siberiano', value: 'siberiano' },
  { label: 'Bombay', value: 'bombay' },
  { label: 'Oriental', value: 'oriental' },
  { label: 'Tonkinés', value: 'tonkines' },
  { label: 'Himalayo', value: 'himalayo' },
  { label: 'Manx', value: 'manx' },
  { label: 'Cornish Rex', value: 'cornish_rex' },
  { label: 'Devon Rex', value: 'devon_rex' },
  { label: 'American Shorthair', value: 'american_shorthair' },
  { label: 'Burmés', value: 'burmes' },
  { label: 'Chartreux', value: 'chartreux' },
  { label: 'Selkirk Rex', value: 'selkirk_rex' },
  { label: 'Singapura', value: 'singapura' },
  { label: 'Somali', value: 'somali' },
  { label: 'Peterbald', value: 'peterbald' },
  { label: 'Bobtail Japonés', value: 'bobtail_japones' },
  { label: 'Korat', value: 'korat' },
  { label: 'LaPerm', value: 'laperm' },
  { label: 'Munchkin', value: 'munchkin' },
  { label: 'Ocicat', value: 'ocicat' },
  { label: 'Pixie-bob', value: 'pixie_bob' },
  { label: 'Savannah', value: 'savannah' },
  { label: 'Snowshoe', value: 'snowshoe' },
  { label: 'Toyger', value: 'toyger' },
];

// export const BreedOptions = [...BreedDogsOptions, ...BreedCatsOptions];
export const groupedOptions = [
  {
    group: 'Perros',
    options: BreedDogsOptions,
  },
  {
    group: 'Gatos',
    options: BreedCatsOptions,
  },
];

export const BreedOptions = {
  perros: BreedDogsOptions,
  gatos: BreedCatsOptions,
  todos: [...BreedDogsOptions, ...BreedCatsOptions],
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

export const inventoryStatusOptions = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'low_stock', label: 'Low Stock' },
];
