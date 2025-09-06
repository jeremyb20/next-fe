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
