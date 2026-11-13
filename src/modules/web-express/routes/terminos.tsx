
import { LegalPage } from "@/modules/web-express/components/LegalPage";
import {
  SITE_URL,
  WHATSAPP_DISPLAY,
  PRICE_DEPOSIT_LABEL,
  PRICE_TOTAL_LABEL,
} from "@/modules/web-express/lib/site";

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y Condiciones" updated="julio de 2026">
      <section>
        <h2>1. El servicio</h2>
        <p>
          <strong>Web Express 24H</strong>, un producto de <strong>Roicas</strong>, ofrece el
          diseño, desarrollo y publicación de un <strong>sitio web de una (1) página</strong> con
          hasta <strong>cinco (5) secciones</strong> (por ejemplo: Nosotros, Servicios, Galería,
          Contacto y una sección adicional), que incluye: botón de WhatsApp, datos de contacto,
          mapa de Google, formulario de contacto, enlaces a redes sociales, diseño responsive,
          certificado SSL, SEO básico y Google Analytics.
        </p>
        <p>
          Sitios de varias páginas, tiendas online, sistemas de reservas u otras funcionalidades no
          descritas se cotizan por separado.
        </p>
      </section>

      <section>
        <h2>2. Tiempo de entrega</h2>
        <p>
          El plazo de entrega es de <strong>24 horas hábiles contadas desde que recibimos el brief
          completo</strong> (información del negocio, servicios, y el material que quieras incluir,
          como logo y fotos). Si falta información esencial, el plazo inicia cuando la recibimos.
          Los fines de semana y festivos no cuentan como horas hábiles.
        </p>
      </section>

      <section>
        <h2>3. Precio y forma de pago</h2>
        <ul>
          <li>
            El precio del servicio es de <strong>{PRICE_TOTAL_LABEL} COP</strong> (pago total, sin
            mensualidades obligatorias).
          </li>
          <li>
            El pago se realiza en dos partes: <strong>50% ({PRICE_DEPOSIT_LABEL} COP) para
            iniciar</strong> el proyecto y <strong>50% al aprobar la entrega</strong>, antes de la
            publicación final en tu dominio.
          </li>
          <li>
            También puedes pagar el 100% por adelantado si lo prefieres. Los pagos se procesan a
            través de <strong>Wompi</strong> (PSE, Nequi, Bancolombia, tarjetas).
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Ajustes y revisiones</h2>
        <p>
          El servicio incluye <strong>una (1) ronda de ajustes sin costo</strong> después de la
          entrega (cambios de textos, imágenes, colores u orden de secciones dentro del alcance
          contratado). Ajustes adicionales o cambios de alcance se cotizan por separado y se
          acuerdan por escrito antes de ejecutarse.
        </p>
      </section>

      <section>
        <h2>5. Hosting y dominio</h2>
        <ul>
          <li>
            El primer año de <strong>hosting y dominio .com</strong> está incluido en el precio
            (sujeto a disponibilidad del nombre de dominio elegido).
          </li>
          <li>
            A partir del segundo año, la renovación se realiza directamente con el proveedor al
            costo vigente, sin intermediarios ni sobrecostos nuestros.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Responsabilidades del cliente</h2>
        <ul>
          <li>
            Entregar información veraz y material (textos, logo, fotos) sobre el cual tenga
            derechos de uso. El cliente responde por el contenido que nos suministra.
          </li>
          <li>Revisar la entrega y aprobar o solicitar la ronda de ajustes dentro de un plazo razonable (7 días calendario).</li>
        </ul>
      </section>

      <section>
        <h2>7. Reembolsos y cancelaciones</h2>
        <ul>
          <li>
            Si aún <strong>no hemos iniciado el trabajo</strong>, puedes cancelar y te
            reembolsamos el 100% del anticipo.
          </li>
          <li>
            Si el trabajo ya inició, el anticipo cubre el diseño y desarrollo realizados y no es
            reembolsable, pero no se cobra el 50% restante si decides no continuar.
          </li>
          <li>
            Si por causas atribuibles a nosotros no entregamos dentro del plazo acordado, puedes
            elegir entre esperar la entrega o cancelar con reembolso del anticipo.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. Propiedad del sitio</h2>
        <p>
          Una vez recibido el pago total, el sitio web, su dominio y su contenido son propiedad del
          cliente. Podemos incluir una mención discreta de autoría en el pie de página y mostrar el
          proyecto en nuestro portafolio, salvo que el cliente solicite lo contrario.
        </p>
      </section>

      <section>
        <h2>9. Limitación de responsabilidad</h2>
        <p>
          El SEO básico incluido mejora la indexación del sitio, pero <strong>no garantizamos
          posiciones específicas en buscadores ni volúmenes de ventas o clientes</strong>, ya que
          dependen de factores externos. Nuestra responsabilidad total se limita al valor
          efectivamente pagado por el servicio.
        </p>
      </section>

      <section>
        <h2>10. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos términos, escríbenos por WhatsApp al{" "}
          {WHATSAPP_DISPLAY}.
        </p>
      </section>
    </LegalPage>
  );
}
