import { paramCase } from '@/utils/change-case';
import { _id, _postTitles } from '@/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

// Función para agregar prefijo de idioma
const withLang = (path: string, includeLang: boolean = true) => {
  if (!includeLang) return path;
  // Esto será reemplazado dinámicamente en runtime
  return `/${path}`;
};

// Función para rutas dinámicas que necesitan el idioma
export const getLocalizedPath = (path: string, lng: string) =>
  path.replace('/:lng', `/${lng}`);

const ROOTS = {
  AUTH: withLang('auth'),
  AUTH_DEMO: withLang('auth-demo'),
  DASHBOARD: withLang('dashboard'),
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: withLang('coming-soon'),
  maintenance: withLang('maintenance'),
  pricing: withLang('pricing'),
  payment: withLang('payment'),
  about: withLang('about-us'),
  contact: withLang('contact-us'),
  faqs: withLang('faqs'),
  page403: withLang('error/403'),
  page404: withLang('error/404'),
  page500: withLang('error/500'),
  components: withLang('components'),
  docs: 'https://docs.minimals.cc', // URLs externas no necesitan idioma
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',

  // Product routes
  product: {
    root: withLang('product'),
    checkout: withLang('product/checkout'),
    details: (id: string) => withLang(`/product/${id}`),
    demo: {
      details: withLang(`/product/${MOCK_ID}`),
    },
  },

  // Petsmarket routes
  petsmarket: withLang('petsmarket'),

  // Post routes
  post: {
    root: withLang('post'),
    details: (title: string) => withLang(`/post/${paramCase(title)}`),
    demo: {
      details: withLang(`/post/${paramCase(MOCK_TITLE)}`),
    },
  },

  // AUTH routes
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
    signIn: withLang('sign-in'),
    signUp: withLang('sign-up'),
    register: `${ROOTS.AUTH}/register`,
    verify: `${ROOTS.AUTH}/verify`,
    forgotPassword: withLang('forgot'), // Directo sin ROOTS
  },

  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  notifications: withLang(`notifications`),
  // DASHBOARD routes
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    petsmarket: {
      root: `${ROOTS.DASHBOARD}/petsmarket`,
      details: (productId: string) =>
        `${ROOTS.DASHBOARD}/petsmarket/${productId}`,
    },

    admin: {
      panelAdmin: `${ROOTS.DASHBOARD}/admin/panel`,
      home: `${ROOTS.DASHBOARD}/admin/home`,

      product: {
        root: `${ROOTS.DASHBOARD}/admin/product`,
        new: `${ROOTS.DASHBOARD}/admin/product/new`,
        details: (productId: string) =>
          `${ROOTS.DASHBOARD}/admin/product/${productId}`,
        edit: (productId: string) =>
          `${ROOTS.DASHBOARD}/admin/product/${productId}/edit`,
        demo: {
          details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
          edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
        },
      },

      inventory: {
        root: `${ROOTS.DASHBOARD}/admin/inventory`,
        new: `${ROOTS.DASHBOARD}/admin/inventory/new`,
        details: (id: string) => `${ROOTS.DASHBOARD}/admin/inventory/${id}`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/admin/inventory/${id}/edit`,
        demo: {
          details: `${ROOTS.DASHBOARD}/inventory/${MOCK_ID}`,
          edit: `${ROOTS.DASHBOARD}/inventory/${MOCK_ID}/edit`,
        },
      },

      usersAdmin: `${ROOTS.DASHBOARD}/admin/users`,
      groomersAdmin: `${ROOTS.DASHBOARD}/admin/groomers`,
      veterinarianAdmin: `${ROOTS.DASHBOARD}/admin/veterinarian`,
      qrPanel: `${ROOTS.DASHBOARD}/admin/qrcode`,
      blogAdmin: `${ROOTS.DASHBOARD}/admin/blog`,
      seoAdmin: `${ROOTS.DASHBOARD}/admin/seo`,
      blogPanel: `${ROOTS.DASHBOARD}/admin/blog`,
      promotions: `${ROOTS.DASHBOARD}/admin/promotions`,
    },

    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },

    user: {
      pets: `${ROOTS.DASHBOARD}/user/pets`,
      addPet: `${ROOTS.DASHBOARD}/user/add-pet`,
      details: (id: string) => `${ROOTS.DASHBOARD}/user/pets/details/${id}`,
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/pets/edit/${id}`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },

    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      checkout: `${ROOTS.DASHBOARD}/product/checkout`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },

    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },

    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) =>
        `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },

    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },

    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },

    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },

  veterinarian: {
    register: withLang('register'),
  },
};

// Helper function to get actual path with language
export const getPath = (path: string, lng: string) => {
  if (path.startsWith('http')) return path; // URLs externas
  return path.replace('/:lng', `/${lng}`);
};
