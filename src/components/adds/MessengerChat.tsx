// components/MessengerChatWidget.tsx

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function MessengerChatWidget() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
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
              // Forzar el parseo del widget si ya está en el DOM
              if (window.FB) {
                window.FB.XFBML.parse();
              }
            };

            var chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute("page_id", "115795170546124");
            chatbox.setAttribute("attribution", "biz_inbox");
          `,
        }}
      />

      <Script
        id="fb-sdk-loader"
        strategy="afterInteractive"
        src="https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js"
      />
    </>
  );
}
