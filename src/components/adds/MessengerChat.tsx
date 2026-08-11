// components/MessengerChatWidget.tsx

import Script from 'next/script';
import { useEffect, useState } from 'react';
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}
export default function MessengerChatWidget() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* El div debe estar vacío y sin atributos adicionales inicialmente */}
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>

      <Script
        id="fb-messenger-sdk-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function() {
              FB.init({
                xfbml: true,
                version: 'v18.0'
              });
            };

            // Configuración manual del chatbox
            var chatbox = document.getElementById('fb-customer-chat');
            if (chatbox) {
              chatbox.setAttribute("page_id", "115795170546124");
              chatbox.setAttribute("attribution", "biz_inbox");
            }
          `,
        }}
      />

      <Script
        id="fb-sdk-loader"
        strategy="afterInteractive"
        src="https://connect.facebook.net/es_LA/sdk.js"
        onLoad={() => {
          // Forzar el parseo una vez que el script se haya cargado completamente
          if (window.FB) {
            window.FB.XFBML.parse();
          }
        }}
      />
    </>
  );
}
