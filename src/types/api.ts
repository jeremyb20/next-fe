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
  refetchOnReconnect?: boolean;
  gcTime?: number;
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
  refetchOnReconnect?: boolean;
  gcTime?: number;
  staleTime?: number;
  retry?: number;
  enabled?: boolean;
  placeholderData?: any;
}

export interface BaseApiResponse {
  status: string;
  message: string;
  payload?: any; // Opcional por si incluye datos adicionales
}

// external interfaces
export interface NotificationData {
  image: string;
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
  image: string;
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
export interface IVaccinesControl {
  dateOfApplication: string;
  nextVaccineDate: string;
  vaccineName: string;
  observations: string;
  _id?: string;
}
export interface IDewormingControl {
  dateOfApplication: string;
  nextDewormingDate: string;
  dewormerName: string;
  observations: string;
  _id?: string;
}

export interface IMedicalVisits {
  visitDate: string;
  reasonForVisit: string;
  veterinarianName: string;
  observations: string;
  _id?: string;
}

export interface IMedicalRecord {
  vaccines: IVaccinesControl[]; // ← Array para historial de vacunas
  deworming: IDewormingControl[]; // ← Array para historial de desparasitación
  datesOfMedicalVisits: IMedicalVisits[]; // ← Array para historial de visitas médicas
}

interface IPetPermissions {
  showPhoneInfo: boolean;
  showEmailInfo: boolean;
  showLinkTwitter: boolean;
  showLinkFacebook: boolean;
  showLinkInstagram: boolean;
  showOwnerPetName: boolean;
  showBirthDate: boolean;
  showAddressInfo: boolean;
  showAgeInfo: boolean;
  showVeterinarianContact: boolean;
  showPhoneVeterinarian: boolean;
  showHealthAndRequirements: boolean;
  showFavoriteActivities: boolean;
  showLocationInfo: boolean;
}

export interface IPetProfile {
  lng: string;
  lat: string;
  _id: string;
  breed: string;
  updatedAt: string | number | Date;
  createdAt: string;
  memberPetId: string;
  genderSelected: string;
  weight: string;
  favoriteActivities: string;
  healthAndRequirements: string;
  phoneVeterinarian: string;
  veterinarianContact: string;
  address: string;
  idParental: string;
  petName: string;
  petFirstSurname?: string;
  petSecondSurname?: string;
  phone: string;
  photo: string;
  birthDate: string;
  ownerPetName: string;
  petStatus: string;
  petViewCounter: ILocation[];
  photo_id: string;
  isDigitalIdentificationActive: boolean;
  permissions: IPetPermissions;
  type?: string;
  owner?: IUserProfile;
  medicalRecord?: IMedicalRecord;
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

export interface IPetStats {
  appointmentsCount: number;
  date: string;
  petsCount: number;
  petsNeedingVaccination: number;
  totalPetCareSpent: number;
  upcomingAppointments: number;
  vaccinationsCount: number;
  vetVisitsCount: number;
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

export interface IMedicalRecordResponse {
  _id: string;
  type: 'vaccine' | 'deworming' | 'medical_visit';
  date: string;
  name: string;
  nextDate?: string;
  veterinarianName?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserSettingsResponse {
  payload: any;
  theme: {
    fontSizeScale: number;
    themeColorPresets: string;
    themeContrast: string;
    themeDirection: string;
    themeLayout: string;
    themeMode: string;
    themeStretch: boolean;
  };
  permissions: {
    showPhoneInfo: boolean;
    showEmailInfo: boolean;
    showPersonalInfo: boolean;
  };
}

export interface IUpcomingAppointment {
  id: string;
  petId: string;
  petName: string;
  petPhoto?: string;
  type: 'vaccine' | 'deworming' | 'medical_visit';
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  veterinarian?: string;
  veterinarianPhone?: string;
  status: 'upcoming' | 'overdue' | 'today';
  daysUntil: number;
}

export interface IUpcomingAppointmentsResponse {
  appointments: IUpcomingAppointment[];
  stats: {
    total: number;
    today: number;
    upcoming: number;
    overdue: number;
    byType: {
      vaccine: number;
      deworming: number;
      medical_visit: number;
    };
  };
  filters: {
    days: number;
    includePast: boolean;
    limit: number;
    petId: string;
  };
  date: string;
}

export interface IUpcomingAppointmentsGroupedResponse {
  pets: {
    petId: string;
    petName: string;
    petPhoto?: string;
    petStatus: string;
    totalAppointments: number;
    appointments: IUpcomingAppointment[];
  }[];
  totalPets: number;
  totalAppointments: number;
  date: string;
}

export interface IPromotions {
  id: string;
  _id: string;
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  urlImage?: string;
  urlImageId?: string;
  icon?: string;
  status: 'active' | 'inactive' | 'expired';
  priority: number;
  type: 'vaccine' | 'grooming' | 'consultation' | 'products' | 'general';
  termsAndConditions?: string;
  applicableTo?: string[];
  code?: string;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
  link: string;
}
