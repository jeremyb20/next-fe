import React from 'react';
import { APP_NAME, EMAIL_SUPPORT, PHONE_SUPPORT } from '@/src/config-global';

import { Container } from '@mui/system';
import { Box, Link, Paper, Typography } from '@mui/material';

const PrivacyPolicy = () => {
  const privacyContent = [
    {
      title: 'POLÍTICA DE PRIVACIDAD',
      content: `La presente Política de Privacidad tiene por objeto dar a conocer el modo en que recabamos, tratamos y protegemos los datos de carácter personal recolectados a través de este sitio web, a fin de que los usuarios determinen libre y voluntariamente si desean facilitar sus datos personales a través de los formularios habilitados para tal efecto. Para efectos de la presente "Política de Privacidad", se entiende por Usuario a la persona que voluntariamente se registre en ${APP_NAME} en los formularios especialmente establecidos para este fin. ${APP_NAME} proporcionará a los usuarios los recursos técnicos adecuados para que, con carácter previo a la cumplimentación de los datos personales, puedan acceder a esta Política de Privacidad y a cualquier otra información relevante en materia de Protección de Datos de Carácter Personal.`,
    },
    {
      title: 'ACEPTACIÓN Y MODIFICACIONES',
      content: `El acceso y uso del Sitio Web por el Usuario implica que acepta en su totalidad y se obliga a cumplir por completo los términos y condiciones recogidos disponibles en nuestro sitio. La prestación del servicio del sitio web tiene una duración limitada al momento en el que el Usuario se encuentre conectado al sitio web o alguno de los servicios que a través del mismo se facilitan; por tanto, el Usuario debe leer atentamente la presente Política de Privacidad en cada una de las ocasiones que se proponga utilizar el sitio web, ya que ésta puede sufrir modificaciones en función de novedades o exigencias legislativas y jurisprudenciales o por necesidades de negocio. La presente Política de Privacidad será válida únicamente para los datos de carácter personal obtenidos en el sitio web, no siendo aplicable para aquella información recabada por terceros en otras páginas web, incluso si éstas se encuentran enlazadas por este sitio web.`,
    },
    {
      title: 'RECOLECCIÓN DE DATOS PERSONALES',
      content: `En cumplimiento con lo dispuesto en la Ley N° 8968 de Protección de la persona frente al tratamiento de sus datos personales y su normativa, publicada en La Gaceta N° 170 del año 2011, ponemos en conocimiento del Usuario que los datos recabados a través de cualesquiera formularios de recogida de datos de este sitio web serán incorporados a los ficheros de datos de carácter personal, respectivamente, de ${APP_NAME} garantizando la confidencialidad de los datos de carácter personal facilitados y el cumplimiento de toda la normativa aplicable al efecto. Todos los campos que aparezcan señalados con un asterisco (*) en dichos formularios serán de obligada cumplimentación, de tal modo que la omisión de alguno de ellos podría comportar la imposibilidad de que se pueda atender su solicitud. Asimismo, al hacer "click" en el botón "Enviar" (o equivalente) incorporado en los citados formularios, declara que la información y los datos que en ellos ha facilitado son exactos y veraces. En el contexto de los tratamientos que se describen a continuación, es posible que suministre datos de carácter personal relativos a terceros. En este sentido, es su responsabilidad informar de tal circunstancia a los terceros cuyos datos nos va a ceder, así como, en caso de ser necesario, obtener su consentimiento expreso para suministrarnos dicha información.`,
    },
    {
      title: 'ALMACENAMIENTO EN CÓDIGO QR',
      content: `Las letras "QR" se derivan de las palabras en inglés "Quick Response", o "Respuesta rápida". Un código QR es un módulo útil para almacenar información en una matriz de puntos o un código de barras bidimensional creado por la compañía japonesa Denso Wave, subsidiaria de Toyota, en 1994. Este sistema se caracteriza por los tres cuadrados que se encuentran en las esquinas y que permiten detectar la posición del código al lector. Los códigos QR pueden leerse desde PC, teléfonos inteligentes o tabletas, mediante dispositivos de captura de imagen, como puede ser un escáner o la cámara de fotos, programas o aplicaciones que lean los datos QR y una conexión a Internet para las direcciones web. Para ${APP_NAME}, los códigos QR serán utilizados para el almacenamiento de datos personales, así como enfermedades, alergias, advertencias médicas, etc, para que pudieran ser leídos en caso de emergencia por paramédicos, enfermeros, médicos, policía, etc., o para ser localizados en caso de algún extravío personal o de su mascota.`,
    },
    {
      title: 'TRATAMIENTO DE DATOS',
      content: `${APP_NAME} deberá gestionar su registro de usuario e identificarlo como "usuario registrado" para así personalizar su interfaz y mostrarle contenido e información acorde a sus intereses. Es indispensable que el Usuario resguarde en todo momento los números de referencia, contraseñas o códigos personalizados que le serán provistos. El Usuario será el único responsable en caso del uso, autorizado o no, de su código personal, y en este sentido se compromete a hacer un uso diligente de dicha información, a no ponerla a disposición de terceros, y a comunicar su pérdida o robo. ${APP_NAME} tratará sus datos con fines privados, siempre que el Usuario haya consentido el pertinente tratamiento de datos personales, ya sea por medios ordinarios o electrónicos. En función de las opciones autorizadas por el Usuario, para la realización de cualquier producto o servicio ofrecido en este sitio web. No comunicaremos los datos de carácter personal del Usuario a terceras empresas pertenecientes o no a ${APP_NAME} sin recabar su previo consentimiento, salvo que la cesión de sus datos fuese necesaria para el mantenimiento de la relación con el Usuario.`,
    },
    {
      title: 'SEGURIDAD',
      content: `El sitio web utiliza técnicas de seguridad de la información generalmente aceptadas en la industria, tales como firewalls, procedimientos de control de acceso y mecanismos criptográficos, todo ello con el objeto de evitar el acceso no autorizado a los datos. Para lograr estos fines, el usuario/cliente acepta que el prestador obtenga datos para efectos de la correspondiente autenticación de los controles de acceso. ${APP_NAME} ha implementado y mantiene los más altos niveles de seguridad exigidos por la Ley para proteger los datos de carácter personal del Usuario frente a pérdidas fortuitas y a accesos, tratamientos o revelaciones no autorizados, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos. No obstante, la transmisión de información a través de Internet no es totalmente segura; por ello, y a pesar de que ${APP_NAME} realizará sus mejores esfuerzos para proteger los datos del Usuario, no puede garantizar la seguridad de los mismos durante el tránsito hasta el Sitio Web. Toda la información que el Usuario facilite, se enviará por su cuenta y riesgo. Una vez recibidos los datos del Usuario, ${APP_NAME} utilizará rigurosos procedimientos y funciones de seguridad para impedir cualquier acceso no autorizado.`,
    },
    {
      title: 'COOKIES',
      content: `Al igual que otros portales de Internet, este sitio web utiliza una tecnología denominada "cookies" para recabar información sobre la forma de utilización del mismo. ${APP_NAME} por su propia cuenta o la de un tercero contratado para la prestación de servicios de medición, pueden utilizar cookies cuando un usuario navega por el sitio web. Las cookies son ficheros enviados al navegador por medio de un servidor web con la finalidad de registrar las actividades del usuario durante su tiempo de navegación. Las cookies utilizadas en este sitio web tienen, en todo caso, carácter temporal con la única finalidad de hacer más eficaz su transmisión ulterior. En ningún caso se utilizarán las cookies para recoger información de carácter personal.`,
    },
    {
      title: 'SITIOS DE TERCEROS',
      content: `En nuestro sitio web se podrían incluir enlaces a sitios controlados por terceros. El Usuario debe recordar que al usar un enlace para acceder desde el Sitio Web a otro, dejarán de surtir efecto esta Política de Privacidad. La presente Política de Privacidad no refleja las prácticas en materia de privacidad de esos otros sitios de terceros. ${APP_NAME} se reserva el derecho de modificar o actualizar de tiempo en tiempo el presente aviso de privacidad, sin necesidad de dar previo aviso al respecto.`,
    },
    {
      title: 'EJERCICIO DE DERECHOS',
      content: `Para ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO) respecto a sus datos personales, así como para cualquier consulta o comentario sobre esta Política de Privacidad, el Usuario podrá dirigirse a ${EMAIL_SUPPORT}. El Usuario también puede contactarnos al teléfono ${PHONE_SUPPORT} durante nuestro horario de atención. Nos comprometemos a responder todas las solicitudes relacionadas con la protección de datos personales en un plazo máximo de 15 días hábiles.`,
    },
  ];

  return (
    <Container sx={{ py: 5 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.neutral' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Registro principal:</strong> {APP_NAME}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Número telefónico:</strong> {PHONE_SUPPORT}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Correo de contacto:</strong> {EMAIL_SUPPORT}
        </Typography>
      </Paper>

      <Box sx={{ pr: 1 }}>
        {privacyContent.map((section, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {section.title}
            </Typography>
            <Typography variant="body2" paragraph>
              {section.content}
            </Typography>
          </Box>
        ))}

        <Box
          sx={{
            mt: 4,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="body2" paragraph>
            <strong>Última actualización:</strong> Esta Política de Privacidad
            fue actualizada por última vez el{' '}
            {new Date().toLocaleDateString('es-CR')}.
          </Typography>
          <Typography variant="body2">
            <strong>Contacto para asuntos de privacidad:</strong> Para cualquier
            consulta relacionada con el tratamiento de sus datos personales,
            puede escribir a{' '}
            <Link href={`mailto:${EMAIL_SUPPORT}`} target="_blank">
              {EMAIL_SUPPORT}
            </Link>{' '}
            o llamar al {PHONE_SUPPORT}.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
