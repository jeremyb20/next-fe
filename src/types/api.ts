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
