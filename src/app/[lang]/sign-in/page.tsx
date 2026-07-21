// src/app/[lang]/sign-in/page.tsx
import { Metadata } from 'next';

import { getSeoMetadata } from '@/utils/seo-metadata';
import JwtLoginView from '@/sections/auth/jwt/jwt-login-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = lang?.toUpperCase() || 'ES';

  const metadata = await getSeoMetadata('sign-in', language);

  return metadata;
}

export default function LoginPage() {
  return <JwtLoginView />;
}
