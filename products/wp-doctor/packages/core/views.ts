import { icon, illustration, serviceCards } from "./landing-parts";
import type { Env } from "./env";
import { escapeHtml as e } from "./http";
import { FORM_VERSION, POLICY_VERSION, issues } from "../contracts";
const cop = (n: number) =>
  new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(n);
function floatingWhatsApp(wa: string | null) {
  const number = wa?.match(/^https:\/\/wa\.me\/([1-9]\d{7,14})(?:\?|$)/)?.[1];
  if (!number) return "";
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Hola, tengo un error en mi WordPress y necesito soporte urgente")}`;
  return `<a href="${e(href)}" class="wa-floating-btn" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"><svg viewBox="0 0 32 32" width="28" height="28" fill="#FFFFFF" aria-hidden="true"><path d="M16 2a14 14 0 0 0-12 21.2L2 30l7-1.9A14 14 0 1 0 16 2zm0 25.5c-2.3 0-4.5-.6-6.4-1.8l-.5-.3-4.2 1.1 1.1-4.1-.3-.5A11.5 11.5 0 1 1 27.5 16 11.5 11.5 0 0 1 16 27.5zm6.3-8.6c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.2-.7.1a9.2 9.2 0 0 1-5-4.4c-.4-.7.4-.6 1.1-2 .1-.3 0-.5 0-.7s-.8-1.9-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 .5 4.3 4.3 0 0 0-1.3 3.2c0 1.9 1.4 3.7 1.6 3.9s2.8 4.3 6.8 6c1 .4 1.7.6 2.3.8 1 .3 1.9.3 2.6.2.8-.1 2.3-.9 2.6-1.8s.3-1.6.2-1.8-.4-.3-.7-.5z"/></svg><span class="wa-floating-tooltip">¿Emergencia? Escríbenos</span></a>`;
}
function shell(
  title: string,
  content: string,
  script?: string,
  admin = false,
  wa: string | null = null,
  pageClass = "",
) {
  return `<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="Diagnóstico externo gratuito de WordPress: rendimiento móvil y PC, señales observadas e informe preliminar. Sin contraseñas. Reparación opcional según alcance.">${admin ? '<meta name="robots" content="noindex,nofollow">' : ""}<link rel="icon" type="image/png" href="/assets/brand/favicon.png"><meta name="theme-color" content="#e41835"><link rel="stylesheet" href="/assets/style.css">${pageClass === "landing" ? '<link rel="stylesheet" href="/assets/landing.css"><link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>' : ""}${script ? `<script type="module" src="${script}"></script>` : ""}</head><body${pageClass ? ` class="${e(pageClass)}"` : ""}><a class="skip" href="#contenido">Saltar al contenido</a>${content}${floatingWhatsApp(wa)}</body></html>`;
}
const brand =
  '<a class="brand" href="/" aria-label="WP Doctor, un producto de Roicas, inicio"><img class="brand-icon" src="/assets/brand/favicon.png" width="42" height="42" alt=""><span><span class="brand-product">WP Doctor</span><small>Un producto de Roicas</small></span></a>';
export function landing(
  env: Env,
  prices: { repair: number; optimization: number; maintenance: number },
  wa: string | null,
) {
  const emailDelivery = env.DELIVERY_MODE === "resend_email";
  const contactFields = emailDelivery
    ? '<label for="email">Correo electrónico</label><input id="email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="tu@empresa.com" maxlength="254" required aria-describedby="email-help"><small id="email-help">Recibirás un enlace privado para consultar y descargar tu PDF.</small><details class="optional-contact"><summary>Agregar WhatsApp (opcional)</summary><label for="phone">WhatsApp</label><input id="phone" name="whatsapp_phone" type="tel" autocomplete="tel" placeholder="+57 300 123 4567" maxlength="30" aria-describedby="phone-help"><small id="phone-help">Solo para conversar sobre esta solicitud. No es necesario para recibir el correo.</small></details>'
    : '<label for="phone">WhatsApp</label><input id="phone" name="whatsapp_phone" type="tel" autocomplete="tel" placeholder="+57 300 123 4567" maxlength="30" required aria-describedby="phone-help"><small id="phone-help">Te responderemos por aquí. Cuando corresponda, compartiremos el informe preliminar en PDF.</small>';
  const staging = env.ENVIRONMENT !== "production";
  const nav =
    '<a href="#problemas">Servicios</a><a href="#proceso">Cómo funciona</a><a href="#precios">Precios</a>';
  const faq = [
    [
      "¿Cómo les doy acceso si contrato una reparación?",
      "Después de acordar el alcance, te indicaremos cómo habilitar un acceso administrativo temporal. Una opción es Temporary Login, si es compatible con tu instalación: permite compartir un enlace privado sin entregar tu contraseña principal. Lo usaremos únicamente para el trabajo autorizado. Al terminar, revoca el acceso y elimina el plugin si ya no lo necesitas. El diagnóstico gratuito no requiere este acceso.",
      "https://wordpress.org/plugins/temporary-login/",
    ],
    [
      "¿El diagnóstico realmente es gratis?",
      `Sí. La revisión externa preliminar no tiene costo. Algunas causas necesitan una investigación interna autorizada para confirmarse. Si decides contratar la reparación técnica con nosotros, nuestro servicio parte desde $${cop(prices.repair)} COP.`,
    ],
    [
      "¿Necesitan mi contraseña de WordPress para el diagnóstico?",
      "No. El diagnóstico preliminar se realiza de forma no invasiva mediante análisis externo de rendimiento y respuestas de servidor. Solo si contratas la reparación formal te solicitaremos acceso temporal con permisos controlados.",
    ],
    [
      "¿Cuánto tardan en enviarme el reporte?",
      "Al activar el chequeo automático, la web mostrará su estado y limitará la espera a dos minutos. Si una prueba no termina, te lo indicará sin dar el diagnóstico por completado. La entrega del mensaje puede tardar más; las revisiones del equipo se atienden en horario hábil.",
    ],
    [
      "¿Qué pasa si mi problema requiere una solución compleja?",
      "Diferenciamos lo observado de las causas aún por confirmar. Si hace falta investigar con acceso autorizado, te explicaremos el alcance y la cotización antes de intervenir. Tú decides si contratas.",
    ],
  ];
  return shell(
    "Diagnóstico y reparación WordPress | WP Doctor",
    `${staging ? '<div class="staging">Servicio en preparación · Recepción de diagnósticos y entregas aún no habilitadas</div>' : ""}
    <header class="header wrap">${brand}<nav class="desktop-nav" aria-label="Principal">${nav}</nav><a class="button small header-cta" href="#solicitud">Solicitar diagnóstico ${icon("arrow")}</a><details class="mobile-nav"><summary>Menú ${icon("menu")}</summary><nav aria-label="Principal móvil">${nav}<a href="#solicitud">Solicitar diagnóstico</a></nav></details></header>
    <main id="contenido">
      <section class="hero wrap" aria-labelledby="hero-title">
        <div class="hero-copy"><p class="eyebrow">ESPECIALISTAS EN WORDPRESS</p><h1 id="hero-title">Tu WordPress funcionando.<br><span>Tu negocio avanzando.</span></h1><p class="hero-sub">Identifica qué falla en tu web y conoce el siguiente paso para solucionarlo.</p>
          <div class="pain-points"><p>${icon("pulse")} Te ayudamos con:</p><ul class="pain-tags" aria-label="Problemas frecuentes"><li>${icon("monitor")} Pantalla blanca</li><li>${icon("database")} Error de base de datos</li><li class="pain-critical">${icon("alert")} Error 500 / Crítico</li><li>${icon("speed")} Web lenta</li><li>${icon("plug")} Fallas por plugins</li></ul></div>
          <form id="hero-url-form" class="hero-url-form" novalidate><label for="hero-url">URL de tu WordPress</label><div class="hero-url-row"><input id="hero-url" name="website_url" inputmode="url" autocomplete="url" placeholder="https://tuempresa.com" maxlength="2048" required aria-describedby="hero-url-help hero-url-error"><button id="hero-url-continue" class="button" type="submit">Diagnóstico gratis ${icon("arrow")}</button></div><p id="hero-url-help">Revisamos la página de inicio. Sin contraseñas.</p><p id="hero-url-error" class="field-error" role="status"></p></form><a class="text-link hero-services-link" href="#problemas">Ver servicios</a>
          <ul class="hero-trust"><li>${icon("check")} Sin contraseñas</li><li>${icon("check")} Sin compromiso</li></ul>
        </div>
        <figure class="hero-visual">${illustration("hero-laptop")}<div class="visual-badge badge-report" aria-hidden="true">${icon("chart")}<span>Diagnóstico WordPress</span></div><div class="visual-badge badge-error" aria-hidden="true">${icon("alert")}<span><strong>Error de conexión</strong><code>Error establishing a database connection</code></span></div><div class="visual-badge badge-next" aria-hidden="true">${icon("check")}<span><strong>Un siguiente paso claro</strong><small>Según la evidencia disponible</small></span></div><figcaption>Vista ilustrativa · No es un diagnóstico de tu sitio.</figcaption></figure>
      </section>
      <section class="trust-strip" aria-label="Nuestro compromiso"><div class="wrap"><p>${icon("search")} Diagnóstico externo gratuito</p><p>${icon("file")} Presupuesto antes de intervenir</p><p>${icon("pin")} Atención en Colombia y LatAm</p></div></section>
      <section class="section wrap services-section" id="problemas"><div class="section-heading centered"><p class="eyebrow">NUESTROS SERVICIOS</p><h2>Tu web no debería frenar tu negocio.</h2><p>Soluciones para los problemas que afectan tu día a día.</p></div><div class="problem-grid">${serviceCards()}</div></section>
      <section class="report-section" id="informe"><div class="wrap report-layout"><figure>${illustration("diagnostico-informe")}<figcaption>Vista ilustrativa</figcaption></figure><div><p class="eyebrow">UN INFORME PARA DECIDIR</p><h2>Entiende qué pasa.<br><span>Decide con claridad.</span></h2><ul class="report-benefits"><li>${icon("check")} Rendimiento en móvil y PC.</li><li>${icon("check")} Hallazgos con evidencia disponible.</li><li>${icon("check")} Próximos pasos explicados.</li></ul><p class="report-scope">La revisión inicial analiza señales externas. Los problemas internos requieren una revisión adicional.</p></div></div></section>
      <section class="section wrap process-section" id="proceso"><div class="section-heading centered"><p class="eyebrow">PROCESO</p><h2>Así de claro. <span>Así de simple.</span></h2><p>De una URL a un siguiente paso claro. Tú mantienes el control.</p></div><ol class="process-grid">${[
        [
          "01",
          "Comparte tu URL.",
          "Cuéntanos cuál es tu web y qué está pasando. Sin contraseñas.",
        ],
        [
          "02",
          "Revisamos tu web.",
          "Analizamos señales externas y distinguimos lo observado de lo pendiente.",
        ],
        [
          "03",
          "Recibe tu informe.",
          "Un diagnóstico preliminar con hallazgos, alcance y próximos pasos.",
        ],
        [
          "04",
          "Tú decides.",
          "Con el informe, eliges el siguiente paso. Contratar una reparación es opcional.",
        ],
      ]
        .map(
          ([n, title, text], index) =>
            `<li><div class="process-card-top"><span class="process-icon">${icon((["link", "search", "file", "check"] as const)[index] ?? "check")}</span><span class="step-number" aria-hidden="true">${n}</span></div><h3>${title}</h3><p>${text}</p><span class="process-caption">${["Sin compartir accesos", "Evidencia disponible", "Un informe para ti", "Sin compromiso de contratar"][index]}</span></li>`,
        )
        .join(
          "",
        )}</ol><div class="process-action"><a class="button" href="#solicitud">Comenzar mi diagnóstico ${icon("arrow")}</a><p>Gratuito · Sin contraseñas</p></div></section>
      <section class="section wrap prices-section" id="precios"><div class="section-heading centered"><p class="eyebrow">PLANES</p><h2>Una solución para cada momento.</h2></div><div class="pricing-grid">
        <article class="price-card"><h3>${icon("wrench")} Reparación puntual</h3><p class="price"><small>Desde</small> $${cop(prices.repair)} <span>COP</span></p><p>Un error delimitado de complejidad básica. No incluye rediseño ni reconstrucción.</p><a class="button outline" href="#solicitud" data-issue="errores_caidas" data-service="Reparación puntual">Consultar reparación</a></article>
        <article class="price-card featured"><h3>${icon("chart")} Optimización</h3><p class="price"><small>Desde</small> $${cop(prices.optimization)} <span>COP</span></p><p>Revisión y ajustes de imágenes, caché o recursos cuando proceda. Sin prometer una puntuación PageSpeed.</p><a class="button" href="#solicitud" data-issue="lentitud" data-service="Optimización">Consultar optimización</a></article>
        <article class="price-card"><h3>${icon("calendar")} Mantenimiento</h3><p class="price"><small>Desde</small> $${cop(prices.maintenance)} <span>COP/mes</span></p><p>Actualizaciones controladas, respaldo y verificaciones con tareas y alcance definidos en contrato.</p><a class="button outline" href="#solicitud" data-service="Mantenimiento">Consultar mantenimiento</a></article>
      </div><p class="price-conditions"><strong>Recibimos pagos por Wompi.</strong><br>El pago se realiza después de aprobar el alcance y el valor de tu cotización.</p><p class="price-conditions">Precio final según alcance. Cotización y autorización antes de intervenir.<br>Hosting, licencias premium y servicios de terceros no incluidos. Impuestos aplicables según facturación. <a href="/condiciones">Consultar condiciones</a>.</p></section>
      <section class="request-section" id="solicitud"><div class="wrap request-layout"><div class="request-copy"><p class="eyebrow">TU DIAGNÓSTICO GRATUITO</p><h2>El primer paso para recuperar tu web.</h2><p class="intro">Comienza con un diagnóstico externo gratuito.</p><p class="request-trust">${icon("check")} Sin contraseñas. Sin compromiso de contratar.</p><p class="request-explainer">Solo necesitamos tu URL y ${emailDelivery ? "correo. WhatsApp es opcional" : "WhatsApp"}. La reparación se cotiza por separado, con tu autorización.</p>${wa ? `<a class="text-link" href="${e(wa)}" target="_blank" rel="noopener noreferrer">¿Prefieres consultar por WhatsApp? ${icon("arrow")}</a>` : '<p class="micro">El canal comercial se habilitará antes de la publicación.</p>'}</div>
      <div class="form-card"><p id="availability-note" class="availability-note" hidden role="status"></p><p id="service-selection" class="service-selection" hidden></p><div class="form-top"><strong>Tu diagnóstico gratuito</strong><span id="step-label">Paso 1 de 2</span></div><div class="progress" aria-hidden="true"><span id="progress-fill"></span></div>
  <form id="lead-form" data-channel="${emailDelivery ? "email" : "whatsapp"}" data-policy="${POLICY_VERSION}" data-version="${FORM_VERSION}" novalidate>
  <div id="form-feedback" class="feedback" role="status" aria-live="polite" tabindex="-1"></div><a id="quota-contact" class="button outline full" hidden ${wa ? `href="${e(wa)}"` : ""} target="_blank" rel="noopener noreferrer">Necesito otro diagnóstico: hablar con WP Doctor ↗</a>
  <fieldset id="step-one"><legend>Comienza con el enlace de tu web.</legend><label for="website">URL de tu página</label><input id="website" name="website_url" placeholder="https://tuempresa.com" autocomplete="url" inputmode="url" required maxlength="2048" aria-describedby="website-help website-error"><small id="website-help">Revisamos únicamente la página de inicio del dominio. Dos diagnósticos gratuitos por correo cada 30 días.</small><span id="website-error" class="field-error"></span>
  <label for="issue">¿Qué está pasando? <small>Opcional</small></label><select id="issue" name="issue_type"><option value="">Puedes contarnos qué has notado</option>${Object.entries(
    issues,
  )
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join(
      "",
    )}</select><button class="button full" type="button" id="continue">Continuar al paso final →</button><p class="micro">En el siguiente paso te pediremos tu ${emailDelivery ? "correo para enviarte el enlace del PDF" : "WhatsApp para enviarte el PDF"}.</p></fieldset>
  <fieldset id="step-two" hidden disabled><legend>¿A dónde te enviamos el diagnóstico?</legend><p id="request-summary" class="summary"></p>
  ${contactFields}
  <div class="checks"><label><input name="privacy" type="checkbox" required><span>Acepto la <a href="/privacidad" target="_blank" rel="noopener">política de datos</a> y autorizo la revisión técnica de mi web.</span></label></div>
  <div class="honey" aria-hidden="true"><label for="company">Empresa (dejar vacío)</label><input id="company" name="company" tabindex="-1" autocomplete="off"></div><div id="turnstile"></div><p id="verification-status" class="micro" role="status"></p>
  <button class="button full" type="submit" id="submit" disabled>${emailDelivery ? "Recibir mi diagnóstico por correo" : "Solicitar revisión por WhatsApp"}</button><button class="back" type="button" id="back">← Volver</button></fieldset>
  </form><noscript><p>Para enviar este formulario, activa JavaScript.${wa ? ` También puedes <a href="${e(wa)}">contactarnos por WhatsApp</a>.` : ""}</p></noscript>
  <section id="diagnosis-progress" class="diagnosis-progress" hidden tabindex="-1" aria-labelledby="diagnosis-title"><div class="diagnosis-progress-heading"><span class="diagnosis-spinner" aria-hidden="true"></span><h3 id="diagnosis-title">Registrando tu solicitud</h3></div><p id="diagnosis-status" role="status" aria-live="polite"></p><p id="diagnosis-time" class="micro" aria-live="off"></p><p class="micro">Mostramos el estado real, sin porcentajes estimados. La entrega ${emailDelivery ? "por correo" : "por WhatsApp"} se procesa por separado.</p><button id="check-diagnosis" class="back" type="button" hidden>Consultar estado</button></section>
  <div id="success" hidden tabindex="-1"><span class="success-mark" aria-hidden="true">✓</span><h3 id="success-title">Solicitud recibida</h3><p id="success-message">Hemos registrado tu sitio para revisión del equipo. Te indicaremos el siguiente paso según el alcance de tu caso.</p><p id="success-copy" class="micro"></p><p id="success-state" class="micro">La solicitud quedó registrada para revisión del equipo. No se ha realizado un diagnóstico automático.</p>${emailDelivery ? '<p id="email-delivery-hint" class="email-delivery-hint">¿No ves nuestro correo? Revisa Spam o Correo no deseado y busca <strong>wpdoctor@roicas.com</strong>. Si está allí, márcalo como «No es spam». El enlace privado de descarga llega únicamente al correo indicado.</p>' : ""}<a id="report-download" class="button full" hidden target="_blank" rel="noopener noreferrer">Abrir mi diagnóstico en PDF ↗</a><a id="success-wa" class="button full" ${wa ? `href="${e(wa)}"` : "hidden"} target="_blank" rel="noopener noreferrer">Hablar con WP Doctor sobre mi solicitud ↗</a></div></div></div></section>
      <section class="section wrap" id="preguntas"><div class="faq-layout"><div><p class="eyebrow">PREGUNTAS FRECUENTES</p><h2>Resolvemos tus dudas.</h2></div><div class="faq">${faq.map(([q, a, href]) => `<details><summary>${e(q)}${icon("plus")}</summary><p>${e(a)}${href ? ` <a href="${e(href)}" target="_blank" rel="noopener noreferrer">Consultar Temporary Login en WordPress.org ↗</a>` : ""}</p></details>`).join("")}</div></div></section>
    </main>
    <footer class="wrap footer">${brand}<p>Soporte WordPress · Colombia y LatAm<br><span>Roicas · Marketing y automatizaciones</span></p><nav aria-label="Legal"><a href="/privacidad">Privacidad</a><a href="/condiciones">Condiciones</a>${env.BUSINESS_EMAIL ? `<a href="mailto:${e(env.BUSINESS_EMAIL)}">Contacto</a>` : ""}</nav></footer>`,
    "/assets/public/client.js",
    false,
    wa,
    "landing",
  );
}

export function legalPage(env: Env, path: string) {
  const privacy = path === "/privacidad";
  const draft = env.LEGAL_APPROVED !== "true";
  return shell(
    `${privacy ? "Privacidad" : "Condiciones"} | WP Doctor`,
    `<header class="header wrap">${brand}<a href="/">← Volver al inicio</a></header><main id="contenido" class="legal wrap"><p class="eyebrow">VERSIÓN ${POLICY_VERSION}</p><h1>${privacy ? "Tratamiento de datos" : "Condiciones del servicio"}</h1>${draft ? '<p class="notice">BORRADOR PARA PREPARACIÓN. Este texto debe ser revisado y completado por el responsable antes de publicar el servicio.</p>' : ""}${privacy ? `<h2>Responsable y finalidad</h2><p>${e(env.BUSINESS_NAME || "[Responsable por configurar]")} recibe dominio, problema opcional y los datos de contacto del formulario para tramitar tu solicitud, revisar señales públicas autorizadas y comunicar el diagnóstico preliminar por el canal solicitado. Una reparación posterior se cotiza por separado. No solicitamos contraseñas en el formulario.</p><h2>Contacto y derechos</h2><p>Puedes solicitar consulta, corrección, revocación promocional o supresión de tus datos mediante ${e(env.PRIVACY_CONTACT || "[Canal de privacidad pendiente]")}. Las solicitudes se revisan conforme a las obligaciones aplicables y a la relación contractual.</p><h2>Aceptación y autorización</h2><p>La casilla del formulario reúne la aceptación de la política de datos y la autorización de revisión técnica externa de tu web. Ambas finalidades se registran con su versión. Este formulario no solicita ni otorga consentimiento para promociones. Para el diagnóstico se comparte únicamente el dominio normalizado con Google PageSpeed Insights. En el modo de correo, Resend procesa la dirección y el mensaje solicitado con el enlace privado al informe. Si decides pagar una cotización, Wompi procesa el pago en su plataforma; conservamos referencia, importe y estado de la transacción, sin números de tarjeta ni códigos de seguridad. WhatsApp es opcional para conversar sobre el diagnóstico. En el modo de entrega por WhatsApp, n8n coordina el envío y Kapso y WhatsApp/Meta procesan el número y el PDF solicitado. No se autorizan comunicaciones promocionales.</p><h2>Conservación y acceso</h2><p>Los datos se limitan al personal autorizado y a los proveedores descritos para operar el servicio, incluidos Cloudflare, Vercel y Hostinger. El ejecutor aislado de Hostinger recibe solo la URL y un identificador técnico del trabajo; no recibe los datos de contacto. En la entrega por correo, el enlace privado solo se envía a la dirección indicada; quien tenga ese enlace puede consultar el informe. El seguimiento en la web no permite descargarlo. Se permiten dos diagnósticos gratuitos por correo en un periodo móvil de 30 días; los fallidos o cancelados no consumen cupo. Para controlar el límite se conserva un identificador protegido del correo junto con la solicitud, sujeto a su mismo plazo de eliminación. El enlace privado del informe y su contenido caducan a los 30 días. Los informes y enlaces se eliminan o inhabilitan a los 30 días. Las solicitudes sin contratación ni registros de pago se eliminan tras 90 días sin actividad. Los casos contratados y los registros de pago requieren revisión de las obligaciones de conservación antes de suprimirlos. Las copias de recuperación gestionadas por el proveedor pueden conservar versiones anteriores hasta 30 días, según el plan; una recuperación debe volver a aplicar las supresiones pendientes.</p><h2>Analítica y proveedores</h2><p>Esta versión no instala herramientas externas de analítica comercial. Usa Turnstile para proteger el formulario y registra eventos operativos sin contactos en sus dimensiones. Cualquier integración adicional requiere evaluación y configuración explícita.</p>` : `<h2>Alcance y precios</h2><p>Los importes «desde» son referencias para el servicio básico descrito. La propuesta final se revisa por una persona y requiere acuerdo antes de intervenir. Los precios se expresan en COP; impuestos aplicables según facturación. Hosting, licencias premium, terceros, rediseño y reconstrucción no están incluidos en la reparación básica.</p><h2>Revisión inicial</h2><p>La revisión externa limitada no sustituye una inspección interna autorizada. No se garantizan detección completa, puntuaciones de velocidad ni identificación de causas sin evidencia.</p><h2>Intervención autorizada</h2><p>El envío de este formulario no autoriza cambios en tu web ni constituye una contratación. Alcance, precio final, accesos, respaldo y condiciones de entrega deben acordarse por separado.</p><h2>Mantenimiento y comunicaciones</h2><p>El mantenimiento es opcional. El botón WhatsApp abre una conversación solo por tu clic y no envía mensajes automáticamente. Las promociones requieren autorización separada.</p><h2>Prestador y contacto</h2><p>${e(env.BUSINESS_NAME || "[Identidad mercantil pendiente]")} · ${e(env.BUSINESS_EMAIL || "[Contacto pendiente]")}. El alcance, precio total, plazos, condiciones de facturación y atención de cada intervención se indican en la cotización antes de contratar.</p>`}</main>`,
    undefined,
    false,
    env.WHATSAPP_PUBLIC_NUMBER
      ? `https://wa.me/${env.WHATSAPP_PUBLIC_NUMBER}`
      : null,
  );
}
export function adminPage() {
  return shell(
    "Solicitudes | WP Doctor",
    `<header class="header wrap">${brand}<span class="admin-badge">Panel comercial privado</span><span id="identity"></span></header><main id="contenido" class="wrap admin-main"><p class="eyebrow">OPERACIÓN COMERCIAL</p><h1>Solicitudes</h1><p>Revisa el caso, acuerda el alcance y registra el siguiente paso.</p><div id="admin-message" class="feedback" role="status" aria-live="polite"></div><div id="metrics" class="metrics"></div><div class="admin-layout"><section aria-label="Lista de solicitudes"><button id="refresh" class="button small">Actualizar</button><div id="leads" class="lead-list"></div><button id="more" class="back" hidden>Cargar más</button></section><section id="detail" class="detail" aria-label="Detalle de solicitud"><p class="empty">Selecciona una solicitud para revisarla.</p></section></div></main>`,
    "/assets/admin/client.js",
    true,
  );
}
