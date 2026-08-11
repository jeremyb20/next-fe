'use client';

import Script from 'next/script';

export default function MessengerChatWidget() {
  return (
    <>
      <div id="fb-root" />
      <div
        className="fb-customerchat"
        // @ts-expect-error Facebook custom attributes
        attribution="biz_inbox"
        page_id="115795170546124"
        theme_color="#0084FF"
        logged_in_greeting="¡Hola! ¿En qué podemos ayudar a tu mascota hoy?"
        logged_out_greeting="¡Hola! Déjanos un mensaje."
        greeting_dialog_display="show"
        bottom_spacing="30"
      />
      <Script
        id="facebook-sdk"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function() {
              FB.init({ xfbml: true, version: 'v18.0' });
            };
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v18.0';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `,
        }}
      />
    </>
  );
}
