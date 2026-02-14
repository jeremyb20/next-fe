import React from 'react';
import { APP_NAME, EMAIL_SUPPORT, PHONE_SUPPORT } from '@/src/config-global';

import { Container } from '@mui/system';
import { Box, Link, Paper, Typography } from '@mui/material';

const TermsAndConditions = () => {
  const termsContent = [
    {
      title: 'ACUERDO DE USO',
      content: `Los siguientes términos y condiciones constituyen un acuerdo legal entre ${APP_NAME} y los USUARIOS de su sitio web y rigen el uso que usted le dé al sitio web y a cualquiera de los contenidos, características o funciones disponibles, que pudieran derivarse del mismo. ${APP_NAME} podrá cambiar estos Términos y Condiciones en cualquier momento sin ninguna notificación, sólo publicando y actualizando dichos cambios en este sitio web. AL USAR EL SITIO WEB, USTED como USUARIO ACEPTA Y ESTÁ DE ACUERDO CON ESTOS TÉRMINOS Y CONDICIONES EN LO QUE SE REFIERE A SU USO. Si usted no está de acuerdo con estos Términos y Condiciones, no puede tener acceso al mismo ni usar el sitio web de ninguna otra manera.`,
    },
    {
      title: 'DERECHOS DE PROPIEDAD',
      content: `Entre usted (USUARIO) y nosotros, ${APP_NAME} es dueño único y exclusivo de todos los derechos, título e intereses de su sitio web, de todo el contenido (por ejemplo, audio, fotografías, ilustraciones, otros medios visuales, videos, copias, textos, software, títulos, códigos, datos y materiales del mismo); así como el aspecto, ambiente, diseño, organización, compilación de contenidos, códigos, datos y materiales, incluyendo pero no limitado a, cualesquiera derechos de autor, derechos de marca, derechos de patente, derechos de base de datos, derechos morales, derechos sui generis y otras propiedades intelectuales y derechos patrimoniales del mismo. El sitio web está protegido por las leyes y disposiciones de propiedad intelectual internacionales, por lo que el mismo no podrá ser asignado, sub-licenciado, concedido o transferido en virtud del presente Acuerdo.`,
    },
    {
      title: 'USO DEL SITIO WEB',
      content: `El usuario del sitio web es el único responsable de tener a su disposición el hardware y software necesarios, así como el Dial-Up, DSL, Cable Módem o cualquier otro tipo para lograr su acceso a la Internet y para poder usar este sitio satisfactoriamente. El uso de este sitio web no le otorga al usuario la propiedad de ninguno de los contenidos, códigos, datos o materiales a los que pueda acceder en o a través del mismo, por lo tanto, no podrá almacenar, reproducir, copiar, editar o modificarlos. ${APP_NAME} se reserva todos los derechos conforme a las leyes vigentes; cualquier uso indebido, no autorizado, publicación, distribución, alteración, explotación comercial o promocional del contenido de este sitio o cualquiera de los datos, códigos o materiales, o violación a este acuerdo; está estrictamente prohibido.`,
    },
    {
      title: 'MARCAS COMERCIALES',
      content: `Las marcas comerciales, logos, marcas de servicios, marcas registradas (conjuntamente las "Marcas Comerciales") expuestas en este sitio web o en los contenidos disponibles a través del mismo, son marcas comerciales de ${APP_NAME} registradas y no registradas y otras, y no pueden ser usadas con respecto a otros productos y/o servicios que no estén relacionados, asociados o patrocinados por sus poseedores de derechos y que puedan causar confusión a los clientes, o de alguna manera que denigre o desacredite a sus poseedores de derechos. Todas las marcas comerciales que no sean de ${APP_NAME} y que aparezcan en, o a través, de este sitio web si las hubiera, son propiedad de sus respectivos dueños. El mal uso de las marcas comerciales expuestas en este sitio web, o a través de cualquiera de los servicios del mismo, está estrictamente prohibido.`,
    },
    {
      title: 'PROHIBICIONES PARA EL USUARIO',
      content: `El usuario garantiza y está de acuerdo en que, mientras use el sitio y los diversos servicios, características y funciones que se ofrecen en o a través del mismo, usted no: (a) personalizará a ninguna otra persona o entidad que no sea usted, ni desvirtuará su afiliación con alguna otra persona o entidad; (b) intentará ganar acceso no autorizado a otros sistemas de cómputo a través del sitio web. Usted no: (i) participará en navegar por la red, en "raspar (scraping) la pantalla", "raspar (scraping) la base de datos", en recolectar direcciones de correo electrónico, direcciones inalámbricas u otra información personal o de contactos, o cualquier otro medio automático de obtener listas de usuarios u otra información de o a través del sitio web o de los servicios ofrecidos en o a través del mismo, incluyendo, sin limitación, cualquier información que se encuentre en algún servidor o base de datos relacionada con el sitio web o los servicios ofrecidos en o a través del mismo. (ii) obtendrá o intentará obtener acceso no autorizado a los sistemas de cómputo, materiales o información por cualquier medio; (iii) usará el sitio web o los servicios puestos a su disposición de alguna manera que pudiera interrumpir, dañar, deshabilitar, sobrecargar o deteriorar el sitio web o dichos servicios, incluyendo, sin limitación, mandar mensajes masivos no solicitados o "inundar" servidores con solicitudes; (iv) usará el sitio web o los servicios o artículos del mismo en violación de la propiedad intelectual o de otros derechos legales o patrimoniales de ${APP_NAME} o de algún tercero; ni (v) usará el sitio web o los servicios del sitio web en violación de cualquier ley aplicable.`,
    },
    {
      title: 'COMPRA DE PRODUCTOS Y SERVICIOS',
      content: `${APP_NAME}, pone sus productos y servicios a disposición de visitantes y registrados del sitio web. Si usted ordena cualquier producto, a través del presente documento usted acepta y garantiza que tiene 18 años de edad o más. Se obliga a pagar la totalidad de los precios de cualquier compra que realice ya sea con tarjeta de crédito/débito concurrente con su orden en línea o por otro medio de pago aceptable para ${APP_NAME}. Los productos de ${APP_NAME} se venden solamente a través de este sitio y de distribuidores autorizados en las siete provincias del país. Cualquier costo adicional por transporte y/o entrega, deberá ser asumido por el usuario del servicio. El usuario se obliga a pagar todos los impuestos aplicables.`,
    },
    {
      title: 'INFORMACIÓN PERSONAL',
      content: `Al utilizar este sitio web y/o los servicios puestos a su disposición en o a través del mismo, se le solicitará que proporcione cierta información personalizada (dicha información denominada en lo sucesivo "Información personal del usuario"). Las políticas de privacidad, uso y recopilación de información de ${APP_NAME}, se establecen en nuestra Política de Privacidad. Usted reconoce y acepta ser el único responsable de la exactitud del contenido de la "Información personal del usuario".`,
    },
    {
      title: 'ACEPTACIÓN FINAL',
      content: `Usted como usuario acepta que es una persona mayor de 18 años de edad y declara que ha leído y entendido la información que se describe en el presente acuerdo de Términos y Condiciones. Al aceptar este acuerdo usted estará vinculado con lo que aquí se declara a nombre del "Usuario", de lo contrario, no ingrese a este sitio.`,
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
        {termsContent.map((section, index) => (
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
          }}
        >
          <Typography variant="body2" paragraph>
            <strong>Jurisdicción:</strong> Este acuerdo está regido por las
            leyes costarricenses. Para cualquier reclamo, acción o disputa con
            {APP_NAME}, a partir del uso de este sitio web, tendrá como
            jurisdicción exclusiva a San José, Costa Rica.
          </Typography>
          <Typography variant="body2">
            <strong>Contacto:</strong> Para cualquier comentario u observación,
            podrá escribir a{' '}
            <Link href={`mailto:${EMAIL_SUPPORT}`} target="_blank">
              {EMAIL_SUPPORT}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TermsAndConditions;
