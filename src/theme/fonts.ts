import { Barlow, Public_Sans } from 'next/font/google';

// 🔥 Usar const sin export primero, luego exportar
const primaryFontConfig = Public_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const secondaryFontConfig = Barlow({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const primaryFont = primaryFontConfig;
export const secondaryFont = secondaryFontConfig;
