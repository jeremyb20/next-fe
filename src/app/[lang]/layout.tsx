import { notFound } from 'next/navigation';

import { languages } from '../i18n/settings';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Validar que el idioma sea soportado
  if (!languages.includes(lang as any)) {
    notFound();
  }

  return (
    <>
      {/* Aquí puedes inyectar el idioma a tus providers si es necesario */}
      {children}
    </>
  );
}
