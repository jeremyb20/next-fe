export interface IPetTag {
  _id: string;
  contactName: string;
  contactPhone: string;
  personalization: {
    name: string;
    phone: string;
    fontSize?: number;
    nameFontSize?: number;
    phoneFontSize?: number;
    fontColor: string;
    strokeColor?: string;
    strokeWidth?: number;
    strokePosition?: 'inside' | 'outside' | 'center';
    fontFamily?: string;
    icon?: string;
    moldScale?: number;
    doubleSided?: boolean;
  };
  activePersonalization: {
    name: string;
    phone: string;
    fontSize?: number;
    nameFontSize?: number;
    phoneFontSize?: number;
    fontColor: string;
    strokeColor?: string;
    strokeWidth?: number;
    strokePosition?: 'inside' | 'outside' | 'center';
    fontFamily?: string;
    icon?: string;
    moldScale?: number;
    doubleSided?: boolean;
  };
  tag: {
    id: string;
    shape: string;
    material: string;
    background: string;
  };
  filters: {
    petType: string;
    size: string;
    material: string;
    shape: string;
  };
  images?: {
    imageURL: string;
    imageID: string;
  }[];
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  shape: 'circle' | 'heart' | 'bone';
}
