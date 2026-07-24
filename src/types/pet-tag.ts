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

export interface IPosition {
  x: number;
  y: number;
}

export interface IPersonalization {
  name: string;
  phone: string;
  fontSize: number;
  fontColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokePosition: 'inside' | 'outside' | 'center';
  fontFamily: string;
  moldScale: number;
  namePosition: IPosition;
  phonePosition: IPosition;
  doubleSided: boolean;
  nameFontSize: number;
  phoneFontSize: number;
}

export interface ITagSide {
  image?: { imageURL?: string; imageID?: string };
  personalization?: IPersonalization;
  background?: string;
}

export interface IPetTagOrder {
  _id: string;
  shape: 'circle' | 'heart' | 'bone';
  material: 'resin' | 'aluminum';
  size: string;
  petType: string;
  contactName: string;
  contactPhone: string;
  contactNote?: string;
  front?: ITagSide;
  back?: ITagSide;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
}
