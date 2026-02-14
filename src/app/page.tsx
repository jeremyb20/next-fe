import { redirect } from 'next/navigation';

import { getServerLanguage } from '../utils/get-server-language';

export default async function HomePage() {
  // Esta página solo redirige al middleware
  const language = await getServerLanguage();
  redirect(`/${language.toLowerCase()}` || '/es');
}
