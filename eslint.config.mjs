import perfectionist from 'eslint-plugin-perfectionist';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts',
      '**/next-env.d.ts',
       '**/public/sw.js',        
      '**/public/**/*.js',    
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      perfectionist,
      'unused-imports': unusedImports,
    },
    rules: {
      // Reglas básicas de TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // Desactivamos esta regla porque unused-imports la maneja mejor
      
      // Reglas de unused-imports (para eliminar imports no usados automáticamente)
      'unused-imports/no-unused-imports': 'error', // Elimina imports no usados
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      
      // Reglas de Perfectionist
      'perfectionist/sort-imports': [
        'error',
        {
          // type: 'natural',
          type: 'line-length',
          order: 'asc',
          ignoreCase: true,
        },
      ],
    },
  },
];