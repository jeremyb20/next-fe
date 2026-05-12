interface ServiceWorkerRegistration {
  readonly pushManager: PushManager;
}

export interface DeviceSuscriptions {
  _id: string
  user: string
  endpoint: string
  keys: Keys
  expirationTime: any
  deviceInfo: DeviceInfo
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DeviceInfo {
  type: string
  platform: string
  userAgent: string
  browser: string
  os: string
  deviceId: string
  lastActive: string
}

export interface Keys {
  p256dh: string
  auth: string
}


