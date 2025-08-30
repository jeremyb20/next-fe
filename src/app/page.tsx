import { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  console.log('params*************************************', params);
  return {
    title: '***Minimal: The starting point for your next project',
    description:
      'The most minimal ui library for react -- then start your project by including minimal components.',
  };
}
export default function HomePage() {
  return <HomeView />;
}
