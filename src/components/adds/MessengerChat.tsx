// components/MessengerChatWidget.tsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function MessengerChatWidget() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // No renderizar nada durante la hidratación inicial
  // Esto asegura que servidor y cliente coincidan (ambos null)
  if (!isMounted) return null;

  return (
    <>
      <Script
        id="fb-messenger-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function() {
              FB.init({
                xfbml: true,
                version: 'v18.0'
              });
            };
          `,
        }}
      />

      <Script
        id="fb-sdk-loader"
        strategy="afterInteractive"
        src="https://connect.facebook.net/es_LA/sdk.js"
      />

      {/* Suppress hydration warning para evitar el mismatch */}
      <div
        suppressHydrationWarning
        {...({
          className: 'fb-customerchat',
          page_id: '115795170546124',
          theme_color: '#0084FF',
          logged_in_greeting: '¡Hola! ¿En qué podemos ayudar a tu mascota hoy?',
          logged_out_greeting: '¡Hola! Déjanos un mensaje.',
          greeting_dialog_display: 'show',
        } as any)}
      />
    </>
  );
}
