import "../styles.generated.css";
import { useLocation } from "react-router-dom";

import { LegalPage } from "@/modules/web-express/components/LegalPage";
import { SITE_URL, WHATSAPP_DISPLAY } from "@/modules/web-express/lib/site";

export default function PrivacidadPage() {
  const from = new URLSearchParams(useLocation().search).get("from");
  return (
    <LegalPage
      title="Política de Privacidad"
      updated="julio de 2026"
      campaign={from === "black-november"}
    >
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          <strong>Web Express 24H</strong>, un producto de <strong>Roicas</strong> (en adelante,
          "nosotros"), es responsable del tratamiento de los datos personales recolectados a través
          de este sitio web, conforme a la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de
          2013 de la República de Colombia. Canal de contacto: WhatsApp {WHATSAPP_DISPLAY}.
        </p>
      </section>

      <section>
        <h2>2. Datos que recolectamos</h2>
        <p>Al diligenciar el brief o contactarnos, podemos recolectar:</p>
        <ul>
          <li>Nombre y número de WhatsApp.</li>
          <li>Nombre del negocio, ciudad y sector.</li>
          <li>
            Descripción del negocio, servicios, redes sociales y material que nos compartas (logo,
            fotos, textos).
          </li>
        </ul>
        <p>
          No recolectamos datos sensibles ni datos de menores de edad. No solicitamos ni almacenamos
          datos de tarjetas o credenciales bancarias: los pagos se procesan directamente en la
          plataforma de <strong>Wompi</strong> (Bancolombia), bajo sus propias políticas de
          seguridad y privacidad.
        </p>
      </section>

      <section>
        <h2>3. Finalidad del tratamiento</h2>
        <ul>
          <li>Contactarte para responder tu solicitud y coordinar el proyecto.</li>
          <li>
            Diseñar, desarrollar y publicar tu página web con la información que nos entregas.
          </li>
          <li>Enviarte información relacionada con tu proyecto (avances, entrega, ajustes).</li>
          <li>Emitir la facturación o soporte de pago correspondiente.</li>
        </ul>
        <p>
          <strong>No vendemos ni alquilamos tus datos a terceros.</strong> No te enviaremos
          publicidad masiva no solicitada.
        </p>
      </section>

      <section>
        <h2>4. Terceros que intervienen</h2>
        <ul>
          <li>
            <strong>WhatsApp (Meta):</strong> la comunicación del brief se realiza a través de
            WhatsApp, sujeta a sus términos y política de privacidad.
          </li>
          <li>
            <strong>Wompi (Bancolombia):</strong> procesa los pagos de forma independiente.
          </li>
          <li>
            <strong>Proveedores de hosting y dominio:</strong> para publicar tu sitio web se
            registran los datos estrictamente necesarios (nombre del negocio y dominio).
          </li>
          <li>
            <strong>Herramientas de analítica web</strong> (p. ej. Google Analytics): pueden
            recolectar datos de navegación anónimos o seudonimizados para medir el uso del sitio.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Tus derechos (Habeas Data)</h2>
        <p>Como titular de los datos, tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos por WhatsApp al {WHATSAPP_DISPLAY}.
          Responderemos en los plazos establecidos por la ley (máximo 10 días hábiles para consultas
          y 15 días hábiles para reclamos).
        </p>
      </section>

      <section>
        <h2>6. Conservación y seguridad</h2>
        <p>
          Conservamos tus datos únicamente durante el tiempo necesario para las finalidades
          descritas y las obligaciones legales aplicables. Aplicamos medidas razonables de seguridad
          técnica y organizativa para protegerlos contra acceso no autorizado, pérdida o alteración.
        </p>
      </section>

      <section>
        <h2>7. Cambios a esta política</h2>
        <p>
          Podemos actualizar esta política ocasionalmente. La versión vigente estará siempre
          publicada en esta página con su fecha de actualización.
        </p>
      </section>
    </LegalPage>
  );
}
