import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

export const FIREBASE_API = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId:
    process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
};

export const SUPABASE_API = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

export const STORAGE_KEY = 'accessToken';
export const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN || 'https://plaquitascr.com';

export const LOGO =
  process.env.NEXT_PUBLIC_LOGO ||
  'https://res.cloudinary.com/ensamble/image/upload/v1769553182/petlogo_fpmf2i.png';

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PlaquitasCR';
export const ALLOW_MAX_PETS_BY_USER =
  process.env.NEXT_PUBLIC_ALLOW_MAX_PETS_BY_USER || 10;
export const EMAIL_SUPPORT = process.env.NEXT_PUBLIC_EMAIL_SUPPORT || '';
export const PHONE_SUPPORT = process.env.NEXT_PUBLIC_PHONE_SUPPORT || '';
