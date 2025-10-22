// types/Global response

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, FilterParams {}
export interface UsePaginatedOptions {
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  retry?: number;
  enabled?: boolean;
  placeholderData?: any;
}

export interface ApiResponse<T> {
  payload: T;
  success: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface Ipagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
export interface QueryOptions {
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  retry?: number;
  enabled?: boolean;
  placeholderData?: any;
}

export interface BaseApiResponse {
  status: string;
  message: string;
  payload?: unknown; // Opcional por si incluye datos adicionales
}

// external interfaces
export interface NotificationData {
  _id: string;
  user: string;
  type: string;
  data: any;
  sentAt: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledFor: string | number | Date;
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  status: 'scheduled' | 'sent' | 'canceled';
  __v: number;
  avatarUrl: string;
  category: string;
}

export interface SubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface ScheduleNotificationPayload {
  title: string;
  body: string;
  scheduledTime: string;
}

export interface NotificationResponse {
  id: string;
  status: 'scheduled' | 'sent' | 'canceled';
  message?: string;
}

export interface NotificationFormData {
  title: string;
  body: string;
  date: string;
  time: string;
  scheduledTime?: string;
}

// Admin User interface
export interface IUser {
  id: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  userStatus: string;
  role: number;
  pets: IPetProfile[] | null;
  [key: string]: any; // Para permitir propiedades adicionales
}

export interface IPetProfile {
  _id: string;
  idParental: string;
  petName: string;
  email: string;
  phone: string;
  photo: string;
  age: number;
  birthDate: string;
  ownerPetName: string;
  petStatus: string;
  petViewCounter: ILocation[];
  photo_id: string;
  isDigitalIdentificationActive: boolean;
}

interface ILocation {
  lat: string;
  lng: string;
  dateViewed: string;
  _id: string;
}

export interface IQrCode {
  _id: string;
  status: 'available' | 'assigned' | 'activated' | 'expired' | 'pending';
  purchaseInfo: PurchaseInfo;
  randomCode: string;
  assignedTo: any;
  assignedPet: any;
  activatedBy: any;
  activationDate: string;
  hostName: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface PurchaseInfo {
  price: number;
  seller: string;
  soldDate: any;
}

export interface IQRStats {
  totalCodes: number;
  totalRevenue: number;
  byStatus: ByStatu[];
}

export interface ByStatu {
  status: string;
  count: number;
  totalValue: number;
}
