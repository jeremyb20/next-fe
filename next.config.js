// const { version } = require('./package.json');
// module.exports = {
//   trailingSlash: false,
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
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack'],
//     });
//     return config;
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         port: '',
//         pathname: '/**', // Allow all cloudinary paths
//       },
//     ],
//   },
//   onDemandEntries: {
//     // period (in ms) where the server will keep pages in the buffer
//     maxInactiveAge: 25 * 1000,
//     // number of pages that should be kept simultaneously without being disposed
//     pagesBufferLength: 2,
//   },
//   env: {
//     APP_VERSION: version,
//   },
// };

/// anterior next.config.js
// const { version } = require('./package.json');

// module.exports = {
//   trailingSlash: false,
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
//   },
//   webpack(config, { dev, isServer }) {
//     // Deshabilitar cache solo en desarrollo
//     if (dev) {
//       config.cache = false;
//     }

//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack'],
//     });
//     return config;
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
//   onDemandEntries: {
//     maxInactiveAge: 25 * 1000,
//     pagesBufferLength: 2,
//   },
//   env: {
//     APP_VERSION: version,
//   },
// };

const { version } = require('./package.json');

module.exports = {
  trailingSlash: false,

  // AGREGAR ESTO: Rewrites para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://petsqrbackend.fly.dev/api/:path*',
      },
      // También puedes agregar otras rutas si es necesario
      {
        source: '/health',
        destination: 'https://petsqrbackend.fly.dev/health',
      },
    ];
  },

  // AGREGAR ESTO: Headers CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // O especifica tu dominio: 'https://petsqrbackend.fly.dev'
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
    ];
  },

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
  },

  webpack(config, { dev, isServer }) {
    // Deshabilitar cache solo en desarrollo
    if (dev) {
      config.cache = false;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Opcional: agregar el hostname de tu backend para imágenes
      {
        protocol: 'https',
        hostname: 'petsqrbackend.fly.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  env: {
    APP_VERSION: version,
    // AGREGAR ESTO: Variable de entorno para la URL de la API
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://petsqrbackend.fly.dev'
        : 'http://localhost:8080',
  },
};
