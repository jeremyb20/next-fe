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

// Interface para el perfil del usuario
interface IUserProfile {
  address: string;
  phone: string;
  country: string;
  name: string;
  username: string;
  photoProfile?: string;
  photo_id_profile?: string;
}

// Interface para la configuración del tema
export interface IUserThemeConfig {
  fontSizeScale: number;
  themeColorPresets: string;
  themeContrast: string;
  themeDirection: string;
  themeLayout: string;
  themeMode: string;
  themeStretch: boolean;
}

// Interface para los permisos
export interface IUserPermissions {
  showPhoneInfo: boolean;
  showEmailInfo: boolean;
  showPersonalInfo: boolean;
}

// Interface para la configuración completa
export interface IUserConfiguration {
  theme: IUserThemeConfig;
  permissions: IUserPermissions; // ← Permissions movido aquí
}
// Admin User interface
export interface IUser {
  _id: string;
  isVerified: boolean;
  memberId: string;
  id: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  userStatus: string;
  role: number;
  pets: IPetProfile[] | null;
  userState: number;
  configuration: IUserConfiguration; // ← Permissions ahora está aquí
  profile: IUserProfile;
  // [key: string]: any; // Para permitir propiedades adicionales
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

export interface ISeoContent {
  language: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  metaTags?: Array<{
    name: string;
    content: string;
    attribute?: string;
  }>;
  structuredData?: object;
}

export interface ISeo {
  _id?: string;
  pageId: string;
  route: string;
  contentType: string;
  contentId?: string;
  multiLanguageContent: ISeoContent[];
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  changeFrequency: string;
  lastModified: Date;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
