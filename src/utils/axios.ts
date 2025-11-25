import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API, STORAGE_KEY } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  // Obtener el token de donde lo tengas almacenado (localStorage, sessionStorage, etc.)
  const token = localStorage.getItem(STORAGE_KEY); // o sessionStorage, cookies, etc.

  const headers = {
    ...config?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await axiosInstance.get(url, {
    ...config,
    headers,
  });

  return res.data;
};
// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/user/me',
    login: '/api/user/email/sign-in',
    register: '/api/user/register',
  },
  notification: {
    notifications: '/api/notifications/getNotifications',
    subscribe: '/api/notifications/subscribe',
    schedule: '/api/notifications/schedule',
    unsubscribe: '/api/notifications/unsubscribe',
    delete: '/api/notifications/delete',
  },
  admin: {
    users: {
      getAllRegisteredUsers: '/api/admin/getAllRegisteredUsers',
      updateUserById: '/api/admin/updateUserById',
      deleteUser: '/api/admin/users/delete',
    },
    product: {
      list: '/api/admin/product/list',
      search: '/api/admin/product/search',
      getProductById: '/api/admin/product/details',
      createProduct: '/api/admin/createProduct',
      updateProduct: '/api/admin/updateProduct',
      deleteProduct: '/api/admin/deleteProduct',
    },
    qrcode: {
      getStats: '/api/admin/getQRStats',
      list: '/api/admin/getAllQrCodeList',
      search: '/api/admin/product/search',
      updateQRCode: '/api/admin/updateQRCode',
    },
    seo: {
      list: '/api/admin/getAllSeoList',
      createSeo: '/api/admin/createSeo',
      deleteSeo: '/api/admin/deleteSeo',
      updateSeoById: '/api/admin/updateSeoById',
    },
  },
  pet: {
    getProfileById: '/api/pet/getProfileById',
    updatePetById: '/api/pet/updatePetById',
    createPet: '/api/pet/createPet',
    deletePet: '/api/pet/deletePet',
    details: '/api/pet/details',
    getMedicalRecordsByPet: '/api/pet/getMedicalRecordsByPet',
    updateMedicalRecord: '/api/pet/updateMedicalRecord',
    createMedicalRecord: '/api/pet/createMedicalRecord',
  },
  user: {
    getAllPetsByUser: '/api/user/getAllPetsByUser',
    updateMyProfile: '/api/user/updateMyProfile',
    search: '/api/user/search',
    getUserById: '/api/user/details',
    createUser: '/api/user/create',
    deleteUser: '/api/user/delete',
    registerNewPetByQRcode: '/api/user/registerNewPetByQRcode',
    validateQrCode: '/api/user/validateQrCode',
    addPetToExistingUser: '/api/user/addPetToExistingUser',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
};
