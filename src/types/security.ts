export interface Device {
  id: string;
  name: string;
  location: string;
  lastActive: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

export interface TwoFactorStatus {
  enabled: boolean;
  method: 'app' | 'email' | null;
  email: string;
  phone: string;
}

export interface SecurityLevel {
  level: number;
  items: {
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    backupEmailSet: boolean;
  };
}

export interface IUserSecurity {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'app' | 'email' | null;
  twoFactorSecret?: string;
  twoFactorVerified?: boolean;
  twoFactorTempCode?: string;
  twoFactorTempCodeExpires?: Date;
  backupEmail?: string;
  sessionVersion?: number;
  currentSessionToken?: string;
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationCodeExpires?: Date;
  emailVerificationAttempts?: number;
  lastEmailVerificationSent?: number;
  pendingEmailVerification?: string;
  lastVerificationAttempt?: number;
}