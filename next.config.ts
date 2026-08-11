// next.config.ts - CSP COMPLETA con todos los dominios de Google
import type { NextConfig } from 'next';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const appVersion = packageJson.version;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  compress: true,

  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'petsqrbackend.fly.dev',
      },
      {
        protocol: 'https',
        hostname: 'plaquitascr.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

  // Configuración experimental optimizada
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/lab',
      'lodash',
      'date-fns',
    ],
    scrollRestoration: true,
  },

  // Modularize imports
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },

  // Rewrites para API
  async rewrites() {
    const apiBase =
      process.env.NODE_ENV === 'production'
        ? 'https://petsqrbackend.fly.dev'
        : 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${apiBase}/api/health`,
      },
    ];
  },

  // Headers - CSP COMPLETA para AdSense
  async headers() {
    // const cspValue = [
    //   "default-src 'self'",

    //   // Scripts
    //   "script-src 'self' 'unsafe-eval' 'unsafe-inline' " +
    //     'https://pagead2.googlesyndication.com ' +
    //     'https://*.google.com ' +
    //     'https://*.googleapis.com ' +
    //     'https://www.googletagmanager.com ' +
    //     'https://cdnjs.cloudflare.com ' +
    //     'https://*.cloudflare.com ' +
    //     'https://*.doubleclick.net ' +
    //     'https://*.adtrafficquality.google ' +
    //     'https://connect.facebook.net ' +
    //     'https://*.facebook.com ' +
    //     'https://*.fbcdn.net ' +
    //     'https://*.facebook.net',

    //   // Estilos
    //   "style-src 'self' 'unsafe-inline' " +
    //     'https://fonts.googleapis.com ' +
    //     'https://*.googleapis.com ' +
    //     'https://*.facebook.com',

    //   'img-src * data: blob: https://*.fbcdn.net',

    //   // Fuentes
    //   "font-src 'self' data: " +
    //     'https://fonts.gstatic.com ' +
    //     'https://*.googleapis.com ' +
    //     'https://fonts.googleapis.com ' +
    //     'https://cdn.jsdelivr.net',

    //   // Conexiones
    //   "connect-src 'self' " +
    //     (process.env.NODE_ENV !== 'production'
    //       ? 'http://localhost:8080 '
    //       : '') +
    //     'https://*.google.com ' +
    //     'https://*.googleapis.com ' +
    //     'https://petsqrbackend.fly.dev ' +
    //     'https://api.iconify.design ' +
    //     'https://api.simplesvg.com ' +
    //     'https://api.unisvg.com ' +
    //     'https://cdn.jsdelivr.net ' +
    //     'https://unpkg.com ' +
    //     'https://fonts.googleapis.com ' +
    //     'https://fonts.gstatic.com ' +
    //     'https://*.doubleclick.net ' +
    //     'https://*.googleadservices.com ' +
    //     'https://googleads.g.doubleclick.net ' +
    //     'https://adservice.google.com ' +
    //     'https://*.adtrafficquality.google ' +
    //     'https://*.facebook.com ' +
    //     'https://*.fbcdn.net ' +
    //     'https://*.facebook.net ' +
    //     'wss://*.facebook.com ' +
    //     'wss://*.fbcdn.net ' +
    //     'https://connect.facebook.net',

    //   // Frames - ACTUALIZADO con todos los dominios de Facebook/Messenger
    //   "frame-src blob: about: 'self' " +
    //     'https://*.google.com ' +
    //     'https://*.doubleclick.net ' +
    //     'https://*.googleadservices.com ' +
    //     'https://*.adtrafficquality.google ' +
    //     'https://*.cloudflare.com ' +
    //     'https://*.facebook.com ' +
    //     'https://www.facebook.com ' +
    //     'https://*.fbcdn.net ' +
    //     'https://*.messenger.com ' + // ✅ AÑADIDO
    //     'https://*.fb.com ' + // ✅ AÑADIDO
    //     'https://*.fbsbx.com ' + // ✅ AÑADIDO
    //     'https://l.facebook.com', // ✅ AÑADIDO

    //   // Otros permisos
    //   "manifest-src 'self'",
    //   "worker-src 'self' blob:",
    //   "child-src 'self' blob:",
    //   "object-src 'none'",
    //   "base-uri 'self'",
    //   "form-action 'self'",
    // ].join('; ');
    const cspValue = [
      "default-src 'self'",

      // Scripts: Permitir el SDK y sus subdominios
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://connect.facebook.net https://*.facebook.com https://*.facebook.net",

      // Estilos: Necesarios para el renderizado del widget
      "style-src 'self' 'unsafe-inline' https://*.facebook.com https://*.facebook.net",

      // Imágenes: Facebook usa fbcdn para las fotos de perfil y assets
      'img-src * data: blob: https://*.fbcdn.net https://*.facebook.com',

      // Conexiones: Incluye WebSockets (wss) para el chat en tiempo real
      "connect-src 'self' https://*.facebook.com https://*.facebook.net wss://*.facebook.com https://petsqrbackend.fly.dev",

      // Frames: Crucial para que el chat se muestre
      "frame-src 'self' https://*.facebook.com https://*.messenger.com https://*.facebook.net",

      "child-src 'self' blob:",
      "object-src 'none'",
    ].join('; ');
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },

  // Compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Variables de entorno
  env: {
    APP_VERSION: appVersion,
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://petsqrbackend.fly.dev'
        : 'http://localhost:8080',
  },

  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;

// import type { NextConfig } from 'next';
// import { readFileSync } from 'fs';

// const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
// const appVersion = packageJson.version;

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   trailingSlash: false,
//   compress: true,

//   // Configuración de imágenes
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'petsqrbackend.fly.dev',
//       },
//       {
//         protocol: 'https',
//         hostname: 'plaquitascr.com',
//       },
//     ],
//     formats: ['image/avif', 'image/webp'],
//     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
//     minimumCacheTTL: 31536000,
//   },

//   // Configuración experimental optimizada
//   experimental: {
//     optimizeCss: true,
//     optimizePackageImports: [
//       '@mui/material',
//       '@mui/icons-material',
//       '@mui/lab',
//       'lodash',
//       'date-fns',
//     ],
//     scrollRestoration: true,
//   },

//   // Modularize imports
//   modularizeImports: {
//     '@mui/icons-material': {
//       transform: '@mui/icons-material/{{member}}',
//     },
//     '@mui/material': {
//       transform: '@mui/material/{{member}}',
//     },
//     '@mui/lab': {
//       transform: '@mui/lab/{{member}}',
//     },
//     lodash: {
//       transform: 'lodash/{{member}}',
//     },
//   },

//   // Rewrites para API
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'https://petsqrbackend.fly.dev/api/:path*',
//       },
//       {
//         source: '/health',
//         destination: 'https://petsqrbackend.fly.dev/api/health',
//       },
//     ];
//   },

//   // Headers
//   async headers() {
//     // Solo en producción aplicar headers de caché
//     if (process.env.NODE_ENV !== 'production') {
//       return [];
//     }

//     return [
//       {
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Access-Control-Allow-Credentials',
//             value: 'true',
//           },
//           {
//             key: 'Access-Control-Allow-Origin',
//             value: '*',
//           },
//           {
//             key: 'Access-Control-Allow-Methods',
//             value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
//           },
//           {
//             key: 'Access-Control-Allow-Headers',
//             value:
//               'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
//           },
//         ],
//       },
//       {
//         source: '/_next/static/:path*',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//       {
//         source: '/manifest.json',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=86400, must-revalidate', // 24 horas, no 0
//           },
//         ],
//       },
//     ];
//   },

//   // Compiler
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//     reactRemoveProperties: process.env.NODE_ENV === 'production',
//   },

//   // Variables de entorno
//   env: {
//     APP_VERSION: appVersion,
//     NEXT_PUBLIC_API_URL:
//       process.env.NODE_ENV === 'production'
//         ? 'https://petsqrbackend.fly.dev'
//         : 'http://localhost:8080',
//   },

//   poweredByHeader: false,
//   generateEtags: true,
// };

// export default nextConfig;
