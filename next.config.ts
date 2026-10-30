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
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
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
    const apiBase = process.env.NEXT_PUBLIC_HOST_API;
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
    const cspValue = [
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
      "script-src * 'unsafe-inline' 'unsafe-eval';",
      "connect-src * 'unsafe-inline' wss:;",
      'img-src * data: blob:;',
      'frame-src *;',
      "style-src * 'unsafe-inline';",
      'font-src * data:;',
      "object-src 'none';",
      'worker-src * blob:;',
    ].join(' ');
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
    // removeConsole: process.env.NODE_ENV === 'production',
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
