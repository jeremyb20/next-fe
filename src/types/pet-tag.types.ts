export type PetType = 'dog' | 'cat' | 'other';
export type TagMaterial = 'resin' | 'aluminum';
export type TagShape = 'bone' | 'heart' | 'circle';

export interface TagOption {
  id: string;
  shape: TagShape;
  material: TagMaterial;
  background: string;
  name: string;
  phone: string;
  imageUrl: string;
  isCustomizable: boolean;
}

export interface TagFilters {
  petType: PetType | '';
  size: 'small' | 'medium' | 'large' | '';
  material: TagMaterial | '';
  shape: TagShape;
}

export interface TagBackground {
  id: string;
  name: string;
  imageUrl: string;
  category: 'solid' | 'pattern' | 'image';
}

export interface PersonalizationData {
  name: string;
  phone: string;
  fontSize?: number; // Tamaño base (se mantiene para compatibilidad)
  nameFontSize?: number; // Tamaño específico para el nombre
  phoneFontSize?: number; // Tamaño específico para el teléfono
  fontColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokePosition?: 'inside' | 'outside' | 'center';
  fontFamily?: string;
  icon?: string;
  moldScale?: number;
  moldPosition?: { x: number; y: number };
  namePosition?: { x: number; y: number };
  phonePosition?: { x: number; y: number };
  iconPosition?: { x: number; y: number };
}
