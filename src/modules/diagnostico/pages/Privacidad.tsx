import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-cream/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/products/diagnostico/logo-roicas.webp" alt="ROICAS logo" className="h-8 w-auto md:h-10" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl py-16 md:py-24">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Política de Privacidad y Tratamiento de Datos
        </h1>
        <p className="mt-4 text-sm text-ink-soft">Última actualización: mayo de 2026</p>

        <div className="prose prose-neutral mt-12 max-w-none text-ink-soft [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">

          <p>
            En cumplimiento de la <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos
            Personales de Colombia) y el Decreto 1377 de 2013, <strong>Roicas</strong> (en adelante
            "el Responsable") informa su política para el tratamiento de los datos personales
            recolectados a través del sitio web <strong>https://roicas.com</strong>.
          </p>

          <h2>1. Identificación del Responsable</h2>
          <p>
            <strong>Nombre comercial:</strong> Roicas<br />
            <strong>Correo electrónico:</strong> hola@roicas.com<br />
            <strong>Teléfono:</strong> +57 311 456 5403<br />
            <strong>País:</strong> Colombia
          </p>

          <h2>2. Datos personales recolectados</h2>
          <p>A través de los formularios y herramientas de contacto del sitio web, podemos recolectar:</p>
          <ul>
            <li>Nombre y apellidos</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono / WhatsApp</li>
            <li>Nombre del negocio o empresa</li>
            <li>Información sobre el sitio web o proyecto (URL, descripción)</li>
            <li>Datos de navegación mediante cookies y herramientas analíticas (Google Analytics, Meta Pixel)</li>
          </ul>

          <h2>3. Finalidades del tratamiento</h2>
          <p>Los datos recolectados serán utilizados para:</p>
          <ul>
            <li>Responder solicitudes de información, cotizaciones y diagnósticos SEO</li>
            <li>Agendar y gestionar llamadas de consultoría</li>
            <li>Enviar información sobre servicios, propuestas y seguimiento comercial</li>
            <li>Mejorar la experiencia de usuario en el sitio web mediante análisis estadístico</li>
            <li>Cumplir con obligaciones contractuales cuando se contrate un servicio</li>
          </ul>
          <p>
            Los datos <strong>no serán vendidos, cedidos ni compartidos</strong> con terceros sin
            consentimiento previo, salvo en los casos exigidos por ley o necesarios para la
            prestación del servicio (ej. plataformas de calendario, CRM propio del cliente).
          </p>

          <h2>4. Base legal del tratamiento</h2>
          <p>
            El tratamiento de sus datos se realiza con base en:
          </p>
          <ul>
            <li><strong>Consentimiento:</strong> al completar y enviar cualquier formulario del sitio, usted autoriza el tratamiento de sus datos conforme a esta política.</li>
            <li><strong>Ejecución contractual:</strong> cuando existe una relación de servicios activa.</li>
            <li><strong>Interés legítimo:</strong> para el análisis de uso del sitio web y mejora continua.</li>
          </ul>

          <h2>5. Derechos del titular de los datos</h2>
          <p>En virtud de la Ley 1581 de 2012, usted tiene derecho a:</p>
          <ul>
            <li><strong>Conocer</strong> los datos personales que tenemos sobre usted</li>
            <li><strong>Actualizar</strong> y corregir sus datos cuando sean inexactos o incompletos</li>
            <li><strong>Suprimir</strong> sus datos cuando no sean necesarios para las finalidades autorizadas o cuando haya vencido el periodo de vigencia</li>
            <li><strong>Revocar</strong> la autorización otorgada para el tratamiento</li>
            <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC) cuando considere que se han vulnerado sus derechos</li>
          </ul>

          <h2>6. Procedimiento para ejercer derechos</h2>
          <p>
            Para ejercer cualquiera de los derechos anteriores, envíe una solicitud al correo
            electrónico <strong>hola@roicas.com</strong> con el asunto "Derechos ARCO —
            Protección de datos", indicando su nombre completo, datos de contacto y la
            solicitud concreta. Daremos respuesta en un plazo máximo de <strong>15 días hábiles</strong>.
          </p>

          <h2>7. Uso de cookies y herramientas de terceros</h2>
          <p>El sitio utiliza las siguientes herramientas que pueden recolectar datos de navegación:</p>
          <ul>
            <li><strong>Google Analytics 4 (GA4):</strong> análisis de tráfico y comportamiento del usuario</li>
            <li><strong>Google Ads:</strong> medición de conversiones de campañas publicitarias</li>
            <li><strong>Meta Pixel:</strong> seguimiento de conversiones en Facebook e Instagram</li>
            <li><strong>LeadConnector:</strong> gestión de formularios de contacto y calendario de citas</li>
          </ul>
          <p>
            Estas herramientas operan bajo sus propias políticas de privacidad. Usted puede
            desactivar las cookies desde la configuración de su navegador.
          </p>

          <h2>8. Seguridad de los datos</h2>
          <p>
            Adoptamos medidas técnicas y organizativas razonables para proteger sus datos contra
            acceso no autorizado, pérdida o divulgación indebida. El sitio web opera bajo
            protocolo HTTPS con certificado SSL válido.
          </p>

          <h2>9. Vigencia</h2>
          <p>
            Los datos personales serán conservados mientras exista una relación comercial activa
            o hasta que el titular solicite su eliminación. Los datos de análisis web son
            conservados según los plazos definidos por cada plataforma de terceros.
          </p>

          <h2>10. Modificaciones a esta política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta política cuando sea necesario. Los
            cambios serán publicados en esta misma página con la fecha de actualización
            correspondiente.
          </p>

          <p className="mt-8 text-sm">
            Si tiene dudas sobre esta política, escríbanos a{" "}
            <a href="mailto:hola@roicas.com" className="text-primary hover:underline">
              hola@roicas.com
            </a>{" "}
            o contáctenos por WhatsApp al{" "}
            <a
              href="https://wa.me/573114565403"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              +57 311 456 5403
            </a>
            .
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-ink-soft">
          © 2026 Roicas. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
