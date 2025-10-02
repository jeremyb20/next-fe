// types/Global response
export interface ApiResponse<T> {
  payload: T;
  success: boolean;
  totalPages?: number;
  currentPage?: number;
  total?: number;
  message?: string;
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
export interface User {
  id: string;
  email: string;
  petStatus: string;
  updatedAt: string;
  createdAt: string;
  userState: string;
  newPetProfile: PetProfile[] | null;
}

export interface PetProfile {
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
  petViewCounter: number;
  photo_id: string;
  isDigitalIdentificationActive: boolean;
}
