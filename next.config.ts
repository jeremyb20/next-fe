// next.config.ts
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
    // Deshabilitar temporalmente optimizeCss hasta que beasties funcione
    optimizeCss: true, // 🔥 Cambiar a false para probar
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
    return [
      {
        source: '/api/:path*',
        destination: 'https://petsqrbackend.fly.dev/api/:path*',
      },
      {
        source: '/health',
        destination: 'https://petsqrbackend.fly.dev/api/health',
      },
    ];
  },

  // Headers
  async headers() {
    // Solo en producción aplicar headers de caché
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

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
