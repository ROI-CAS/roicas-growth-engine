import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  Gift,
  Menu,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { CampaignPlanDetails, CampaignPlanComparison } from "@/modules/web-express/components/CampaignPlanDetails";
import { RoicasServices } from "@/modules/web-express/components/RoicasServices";
import { CampaignAvailability } from "@/modules/web-express/components/CampaignAvailability";
import { DesignShowcase } from "@/modules/web-express/components/DesignShowcase";
import { BusinessPresence } from "@/modules/web-express/components/BusinessPresence";
import { PlanIncludes, PlanFooter } from "@/modules/web-express/components/PlanSections";
import { QuotationForm } from "@/modules/web-express/components/QuotationForm";
import { Reveal } from "@/modules/web-express/components/Reveal";
import { WhatsAppIcon } from "@/modules/web-express/components/WhatsAppIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/web-express/components/ui/accordion";
import { Toaster } from "@/modules/web-express/components/ui/sonner";
import { useLandingOffer } from "@/modules/web-express/lib/landing-offer";
import { useMobileChrome } from "@/modules/web-express/hooks/use-mobile-chrome";
import { BLACK_NOVEMBER, formatCOP } from "@/modules/web-express/lib/campaign";
import { getWhatsAppUrl } from "@/modules/web-express/lib/site";
import { track } from "@/modules/web-express/lib/meta";
import { CAMPAIGN_NAVIGATION } from "@/modules/web-express/lib/campaign-navigation";




const HERO_IMAGE = "/products/web-express/images/black-november-hero-3d-v2.webp";
const PAGES_IMAGE = "/products/web-express/images/black-november-pages-3d-v2.webp";
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}
function contact(campaign: string, placement: string, plan = "one_page") {
  track("Contact", { params: { campaign, placement, plan } });
}

export function PremiumCampaign({ serverNow }: { serverNow: number }) {
  const offer = useLandingOffer();
  const chrome = useMobileChrome();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const briefAnchor = useRef<HTMLDivElement>(null);
  const businessPrice = formatCOP(BLACK_NOVEMBER.businessCOP);
  const businessUrl = getWhatsAppUrl(
    "general",
    `Hola Roicas, me interesa la Web empresarial Black November por ${businessPrice}: 4 páginas en total (Inicio + 3 internas). Quiero confirmar contenido, dominio, hosting y plazo antes de contratar.`,
  );
  const reservationUrl = getWhatsAppUrl(
    "general",
    `Hola Roicas, quiero reservar mi One Page de Black November por ${offer.totalLabel} y conservar ese precio para el alcance contratado. Quiero acordar la fecha de inicio en la cotización y confirmar el anticipo de ${offer.depositLabel}.`,
  );
  const showBrief = () => {
    briefAnchor.current?.focus({ preventScroll: true });
    scrollToSection("premium-brief");
  };
  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!video || preference.matches || !window.matchMedia("(min-width: 761px)").matches) return;

    let activated = false;
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;
    const windowWithIdle = window as unknown as {
      requestIdleCallback?: (callback: () => void, options: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const syncPlayback = () => {
      if (preference.matches) video.pause();
      else if (activated) void video.play().catch(() => undefined);
    };
    const activateVideo = () => {
      if (activated || preference.matches) return;
      activated = true;
      video.src = "/products/web-express/web-express/black-november-hero.mp4";
      video.load();
      void video.play().catch(() => undefined);
    };
    const scheduleActivation = () => {
      if (windowWithIdle.requestIdleCallback) {
        idleHandle = windowWithIdle.requestIdleCallback(activateVideo, { timeout: 5000 });
      } else {
        timerHandle = window.setTimeout(activateVideo, 1800);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        scheduleActivation();
      },
      { rootMargin: "120px" },
    );
    observer.observe(video);
    preference.addEventListener("change", syncPlayback);

    return () => {
      preference.removeEventListener("change", syncPlayback);
      observer.disconnect();
      if (idleHandle !== undefined) windowWithIdle.cancelIdleCallback?.(idleHandle);
      if (timerHandle !== undefined) window.clearTimeout(timerHandle);
    };
  }, []);
  useEffect(() => {
    track("ViewContent", {
      value: offer.totalCOP,
      currency: "COP",
      params: { campaign: offer.id, placement: "premium_campaign" },
    });
  }, [offer.id, offer.totalCOP]);
  const questions = [
    {
      q: "¿Qué incluye la One Page?",
      a: "Hasta 5 secciones, dominio .com y hosting durante el primer año, SSL, WhatsApp, Google Maps, formulario y configuración básica de SEO y Analytics. Incluye contenido de apoyo y una ronda de ajustes. El dominio está sujeto a disponibilidad.",
    },
    {
      q: "¿Cuál de los dos formatos necesito?",
      a: `La One Page reúne lo esencial en una sola página por ${offer.totalLabel}. La Web empresarial distribuye la información en 4 páginas en total —Inicio y 3 internas— por ${businessPrice}. Antes de contratar confirmamos su contenido y funciones.`,
    },
    {
      q: "¿Cuándo recibo la propuesta?",
      a: "El plazo de la One Page se confirma en tu cotización según el alcance y la información recibida. Revisas la propuesta, hacemos la ronda de ajustes y publicamos tras tu aprobación y pago del saldo. El plazo de la web empresarial se acuerda según su alcance.",
    },
    {
      q: "¿Cómo puedo pagar?",
      a: `La One Page se paga en dos momentos: ${offer.depositLabel} al reservar y ${offer.depositLabel} al aprobar, antes de publicar. Puedes solicitar un enlace de pago con Wompi. Las condiciones de la Web empresarial se confirman al cotizar.`,
    },
    {
      q: "¿Y si no tengo textos o fotos?",
      a: "Te ayudamos a redactar los textos y a seleccionar imágenes de apoyo para la One Page. Partimos de la información real de tu negocio; no necesitas tener todo preparado para consultarnos.",
    },
    {
      q: "¿Puedo usar el dominio que ya tengo?",
      a: "Sí. En la One Page te ayudamos a conectar tu dominio actual sin costo adicional. Conservas su renovación con tu proveedor; antes de iniciar revisamos los accesos y la configuración necesarios. En la Web empresarial lo dejamos definido en la cotización.",
    },
    {
      q: "¿Qué me entregan al completar el pago?",
      a: "Recibes el sitio y el contenido contratado, con la entrega de accesos y la gestión del dominio definidos en la cotización. Las licencias de imágenes, herramientas o servicios de terceros mantienen sus propias condiciones. Dejamos claro contigo qué se entrega antes de comenzar.",
    },
    {
      q: "¿Puedo reservar ahora y comenzar después?",
      a: "Sí. Contrata hasta el 27 de noviembre y conserva el precio para el alcance de tu cotización. Acordamos contigo la fecha de inicio. La reserva se confirma tras aceptar alcance, fecha y anticipo; una consulta por WhatsApp no confirma la reserva.",
    },
    {
      q: "¿Qué información necesito enviar?",
      a: "Nombre del negocio, servicios principales, datos de contacto, ciudad y logo o fotos propias si las tienes. En la One Page te ayudamos con textos e imágenes de apoyo. Validamos contigo la información antes de publicar.",
    },
    {
      q: "¿Cómo trabajan el diseño? ¿Usan IA?",
      a: "La One Page tiene un alcance definido y un proceso optimizado. Usamos tecnología, automatización e inteligencia artificial para apoyar tareas, junto con adaptación al negocio y revisión humana. Acordamos contigo el plazo de entrega antes de empezar, según el contenido y el alcance. El plazo empresarial se acuerda al cotizar.",
    },
    {
      q: "¿Qué ocurre si no cumplen con el plazo acordado?",
      a: "Si incumplimos por una causa atribuible a nosotros, puedes elegir entre esperar la entrega o cancelar con devolución del anticipo. El compromiso aplica al plazo y alcance acordados; los retrasos por información pendiente o tu revisión no cuentan como incumplimiento nuestro.",
    },
    {
      q: "¿Hasta cuándo aplica y qué pasa después del primer año?",
      a: "Los precios de campaña aplican hasta el 27 de noviembre de 2026, hora Colombia. En la One Page, el dominio y hosting incluidos se renuevan desde el segundo año al costo vigente del proveedor.",
    },
  ];
  return (
    <div className="black-november-page premium-campaign">
      <nav
        className="express-nav premium-nav"
        aria-label="Navegación Black November"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuTrigger.current?.focus();
          }
        }}
        data-scroll-hidden={chrome.hidden}
        inert={chrome.hidden ? "" : undefined}
      >
        <div className="premium-shell">
          <a
            href="#top"
            className="premium-brand"
            aria-label="Web Express Black November, volver al inicio"
          >
            <img
              className="premium-brand-logo"
              src="/products/web-express/images/webexpress-gold-logo.webp"
              width="720"
              height="240"
              alt="WebExpress"
            />
          </a>
          <div className="premium-nav-links" aria-label="Secciones de la oferta">
            {CAMPAIGN_NAVIGATION.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <button className="premium-nav-cta" onClick={() => scrollToSection("planes")}>
            Elegir mi web
            <ArrowUpRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className="premium-menu-toggle"
            ref={menuTrigger}
            aria-label={menuOpen ? "Cerrar menú de secciones" : "Abrir menú de secciones"}
            aria-expanded={menuOpen}
            aria-controls="premium-mobile-links"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <div id="premium-mobile-links" className="premium-mobile-menu" hidden={!menuOpen}>
            {CAMPAIGN_NAVIGATION.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <main>
        <section id="top" className="premium-hero" aria-labelledby="premium-headline">
          <div className="premium-shell premium-hero-grid">
            <div className="premium-hero-copy">
              <p className="premium-keyword-note">
                Diseño de páginas web para tu negocio en Colombia
              </p>
              <h1 id="premium-headline">
                Tu negocio, con web propia y consultas directas por WhatsApp.
              </h1>
              <p className="premium-hero-description">
                Tu página web profesional con hasta 5 secciones, WhatsApp, dominio .com y hosting el
                primer año. Te ayudamos con textos e imágenes.
              </p>
            </div>
            <figure className="premium-hero-visual">
              <CampaignStamp />
              <div className="premium-hero-media">
                <video
                  className="premium-hero-video"
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="/products/web-express/images/black-november-video-poster.webp"
                  aria-hidden="true"
                  disablePictureInPicture
                  disableRemotePlayback
                />
              </div>
              <figcaption>Visual de muestra · Adaptamos el diseño a tu marca</figcaption>
            </figure>
            <div className="premium-hero-conversion">
              <div className="premium-hero-price">
                <span>ONE PAGE · BLACK NOVEMBER</span>
                <strong>{offer.totalLabel}</strong>
                <small>Empieza con {offer.depositLabel}. El saldo, cuando apruebes tu web.</small>
              </div>
              <div className="premium-hero-actions">
                <a
                  className="premium-button premium-whatsapp"
                  href={offer.whatsappUrl("hero")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => contact(offer.id, "hero")}
                >
                  <WhatsAppIcon />
                  Cotizar mi web
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a href="#disenos" className="premium-button premium-button-outline">
                  Ver diseños
                  <ArrowDown aria-hidden="true" />
                </a>
              </div>
              <button
                className="premium-hero-form-link"
                type="button"
                onClick={showBrief}
                aria-controls="premium-brief"
              >
                <FileText aria-hidden="true" />
                ¿Prefieres correo? Solicita una cotización
                <ArrowRight aria-hidden="true" />
              </button>
              <CampaignAvailability serverNow={serverNow} compact />
            </div>
          </div>
        </section>
        <CampaignTicker />
        <section
          id="beneficios"
          className="premium-benefits"
          aria-label="Una web clara y fácil de contactar"
        >
          <div className="premium-shell premium-benefits-grid">
            {[
              {
                type: "browser",
                title: "¿Explicas lo mismo en cada chat?",
                text: "Tus servicios y trabajos, listos para compartir en un enlace.",
              },
              {
                type: "domain",
                title: "Tu imagen, a la altura de tu trabajo.",
                text: "Muestra lo que sabes hacer con una presentación profesional.",
              },
              {
                type: "contact",
                title: "¿La aplazas por falta de contenido?",
                text: "Te ayudamos con textos e imágenes para tu One Page.",
              },
            ].map((item, index) => (
              <Reveal className="premium-benefit" key={item.type} delay={index * 40}>
                <FeatureIllustration type={item.type} />
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <DesignShowcase variant="campaign" onCta={() => scrollToSection("planes")} />
        <BusinessPresence />
        <PlanIncludes />
        <section
          id="primer-paso"
          className="premium-first-step-section"
          aria-labelledby="premium-first-step-heading"
        >
          <div className="premium-shell premium-first-step-grid">
            <Reveal className="premium-first-step-copy">
              <p className="premium-eyebrow">EL PRIMER PASO ES SENCILLO</p>
              <h2 id="premium-first-step-heading">
                Cada mes sin web
                <br />
                <span>es un cliente que no te encuentra.</span>
              </h2>
              <p>
                Quienes te buscan en Google encuentran primero a tu competencia. Cuéntanos qué haces
                y te orientamos por WhatsApp, sin compromiso.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <FirstStepForm offerId={offer.id} totalLabel={offer.totalLabel} />
            </Reveal>
          </div>
        </section>
        <section id="planes" className="premium-plans">
          <div className="premium-shell">
            <Reveal className="premium-section-heading">
              <div>
                <p className="premium-eyebrow">PRECIOS DE BLACK NOVEMBER</p>
                <h2>
                  El espacio que
                  <br />
                  <span>tu negocio necesita.</span>
                </h2>
              </div>
              <CampaignAvailability serverNow={serverNow} />
            </Reveal>
            <div className="premium-plan-grid">
              <article className="premium-plan-card">
                <figure className="premium-plan-art">
                  <img
                    src={HERO_IMAGE}
                    srcSet="/products/web-express/images/black-november-hero-3d-mobile-v2.webp 768w, /products/web-express/images/black-november-hero-3d-v2.webp 1536w"
                    sizes="(max-width:760px) 100vw, 45vw"
                    alt="One Page de muestra en computador y móvil"
                    width="1536"
                    height="1024"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="premium-plan-body">
                  <div className="premium-plan-heading">
                    <h3>Página web One Page</h3>
                    <span>TODO EN UNA PÁGINA</span>
                  </div>
                  <p className="premium-plan-intro">
                    Para presentar lo esencial y facilitar el contacto.
                  </p>
                  <p className="premium-plan-price">
                    {offer.totalLabel}
                    <span>precio de noviembre</span>
                  </p>
                  <div className="premium-included-benefit">
                    <Gift aria-hidden="true" />
                    <div>
                      <span>BENEFICIO INCLUIDO · ONE PAGE</span>
                      <h4>Tu primer año de dominio y hosting, incluido.</h4>
                      <p>
                        Dominio .com + hosting + SSL. Tu dirección propia, con la parte técnica
                        resuelta.
                      </p>
                      <small>
                        1 año desde su activación. Dominio sujeto a disponibilidad; renovación desde
                        el segundo año.
                      </small>
                    </div>
                  </div>
                  <ul>
                    {[
                      "Hasta 5 secciones en una página",
                      "Diseño adaptable a computador y móvil",
                      "WhatsApp, Maps y formulario",
                      "Textos e imágenes de apoyo + una ronda de ajustes",
                    ].map((t) => (
                      <li key={t}>
                        <Check aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="premium-plan-timing">
                    Plazo de entrega acordado en tu cotización, con el brief completo.
                  </p>
                  <CampaignPlanDetails plan="one_page" />
                  <div className="premium-plan-actions">
                    <a
                      className="premium-button premium-whatsapp"
                      href={offer.whatsappUrl("pricing")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => contact(offer.id, "one_page_card")}
                    >
                      <WhatsAppIcon />
                      Quiero mi One Page
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <a
                      className="premium-payment-link"
                      href={offer.checkoutUrl ?? offer.whatsappUrl("payment")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => contact(offer.id, "wompi")}
                    >
                      <CreditCard aria-hidden="true" />
                      {offer.checkoutUrl ? "Pagar con Wompi" : "Solicitar enlace de pago"}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                  <p className="premium-plan-footnote">
                    2 pagos de {offer.depositLabel}: al reservar y al aprobar.
                  </p>
                </div>
              </article>
              <article className="premium-plan-card">
                <figure className="premium-plan-art">
                  <img
                    src={PAGES_IMAGE}
                    srcSet="/products/web-express/images/black-november-pages-3d-mobile-v2.webp 800w, /products/web-express/images/black-november-pages-3d-v2.webp 1600w"
                    sizes="(max-width:760px) 100vw, 45vw"
                    alt="Cuatro páginas de muestra: Inicio, Nosotros, Servicios y Contacto"
                    width="1774"
                    height="887"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="premium-plan-body">
                  <div className="premium-plan-heading">
                    <h3>Web empresarial</h3>
                    <span>4 PÁGINAS EN TOTAL</span>
                  </div>
                  <p className="premium-plan-intro">Para darle a cada tema su propio espacio.</p>
                  <p className="premium-plan-price">
                    {businessPrice}
                    <span>precio de noviembre</span>
                  </p>
                  <ul>
                    {[
                      "Inicio + 3 páginas internas",
                      "Cada página con su propia dirección",
                      "Navegación adaptable a computador y móvil",
                      "Estructura según los servicios de tu negocio",
                    ].map((t) => (
                      <li key={t}>
                        <Check aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="premium-plan-timing">
                    Confirmamos contenido, dominio, hosting y plazo contigo.
                  </p>
                  <CampaignPlanDetails plan="business" />
                  <div className="premium-plan-actions">
                    <a
                      className="premium-button premium-whatsapp"
                      href={businessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => contact(offer.id, "business_card", "business_4_pages")}
                    >
                      <WhatsAppIcon />
                      Quiero mi web empresarial
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <a href="#faq" className="premium-payment-link">
                      ¿Qué formato me conviene?
                      <ArrowDown aria-hidden="true" />
                    </a>
                  </div>
                  <p className="premium-plan-footnote">
                    Las funciones especiales se cotizan por separado.
                  </p>
                </div>
              </article>
            </div>
            <div className="premium-plan-guidance">
              <CampaignPlanComparison />
              <a href="#condiciones">
                Ver condiciones del servicio
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <section id="proceso" className="premium-process">
          <div className="premium-shell premium-process-grid">
            <div className="premium-process-copy">
              <p className="premium-eyebrow">SIN COMPLICARTE LA VIDA</p>
              <h2>
                Tú pones el negocio.
                <br />
                <strong>Nosotros, la web.</strong>
              </h2>
              <ol>
                <li>
                  <span>01</span>Nos cuentas qué haces
                </li>
                <li>
                  <span>02</span>Diseñamos tu propuesta
                </li>
                <li>
                  <span>03</span>Apruebas y publicamos
                </li>
              </ol>
              <div id="garantia" className="premium-approval-promise">
                <ShieldCheck aria-hidden="true" />
                <div>
                  <h3>Revisas antes de publicar.</h3>
                  <p>
                    En la One Page tienes una ronda de ajustes incluida. Pagas el saldo cuando
                    apruebes la propuesta.
                  </p>
                  <p className="premium-delivery-commitment">
                    <strong>Compromiso de entrega.</strong> Si incumplimos el plazo acordado por una
                    causa atribuible a nosotros, puedes cancelar y solicitar la devolución del
                    anticipo. <a href="#condiciones">Consulta las condiciones.</a>
                  </p>
                </div>
              </div>
              <div className="premium-process-contact">
                <a
                  className="premium-button premium-process-whatsapp"
                  href={offer.whatsappUrl("general")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => contact(offer.id, "process")}
                >
                  <WhatsAppIcon /> Solicitar por WhatsApp <ArrowUpRight aria-hidden="true" />
                </a>
                <p>Cuéntanos tu idea y te orientamos para elegir tu web.</p>
                <button
                  type="button"
                  className="premium-process-email"
                  onClick={showBrief}
                  aria-controls="premium-brief"
                >
                  <FileText aria-hidden="true" /> Prefiero recibir la cotización por correo
                </button>
              </div>
            </div>
            <Reveal className="premium-process-art">
              <img
                src={PAGES_IMAGE}
                srcSet="/products/web-express/images/black-november-pages-3d-mobile-v2.webp 800w, /products/web-express/images/black-november-pages-3d-v2.webp 1600w"
                sizes="(max-width:760px) 100vw, 65vw"
                alt="Composición 3D de páginas para presentar una empresa"
                width="1774"
                height="887"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>
        </section>
        <section id="faq" className="premium-faq">
          <div className="premium-shell premium-faq-grid">
            <div>
              <p className="premium-eyebrow">DECIDE CON CLARIDAD</p>
              <h2>
                Tu próxima web.
                <br />
                <span>Sin dudas pendientes.</span>
              </h2>
              <a
                className="premium-text-link"
                href={offer.whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                Hablemos de tu negocio
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <Accordion type="single" collapsible className="premium-questions">
              {questions.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section id="condiciones" className="premium-conditions">
          <div className="premium-shell">
            <details>
              <summary>
                <span>
                  <ShieldCheck aria-hidden="true" />
                  Condiciones de la campaña y del servicio
                </span>
                <ChevronDown aria-hidden="true" />
              </summary>
              <div className="premium-conditions-content">
                <p>
                  Precios vigentes hasta el {BLACK_NOVEMBER.endsLabel}: One Page {offer.totalLabel};
                  Web empresarial {businessPrice}, 4 páginas en total.
                </p>
                <p>
                  One Page: 50% para reservar y 50% al aprobar antes de publicar. Plazo de entrega
                  confirmado en la cotización, según el alcance y con el brief completo. Una ronda
                  de ajustes. Dominio .com sujeto a disponibilidad y hosting con SSL incluidos un
                  año desde su activación; renovación desde el segundo al costo vigente del
                  proveedor.
                </p>
                <p>
                  La contratación hasta el 27 de noviembre conserva el precio para el alcance de la
                  cotización. La fecha de inicio se acuerda en cada cotización. La reserva se
                  confirma tras aceptar el alcance, la fecha y el anticipo correspondiente. Los
                  cambios de alcance se cotizan por separado.
                </p>
                <p>
                  Si no entregamos dentro del plazo acordado por una causa atribuible a nosotros,
                  puedes esperar la entrega o cancelar con devolución del anticipo. El tiempo de
                  revisión del cliente y los retrasos por información pendiente no forman parte del
                  plazo de entrega.
                </p>
                <p>
                  El contenido, funciones, pagos, dominio, hosting y plazo de la Web empresarial se
                  confirman antes de contratar. Las funciones especiales se cotizan por separado.
                </p>
              </div>
            </details>
          </div>
        </section>
        <section className="premium-final" aria-labelledby="premium-seasonal-close">
          <div className="premium-shell">
            <div>
              <p className="premium-eyebrow">BLACK NOVEMBER</p>
              <h2 id="premium-seasonal-close">
                Esta vez, no dejes
                <br />
                <span>tu web para después.</span>
              </h2>
              <p className="premium-reservation-copy">
                Reserva tu precio de noviembre. La fecha de inicio se acuerda en tu cotización.
              </p>
            </div>
            <div className="premium-final-offer">
              <span>ONE PAGE · BLACK NOVEMBER</span>
              <strong>{offer.totalLabel}</strong>
              <p>Empieza con {offer.depositLabel}. El saldo, al aprobar.</p>
              <a href="#planes">
                También Web empresarial · {businessPrice}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div className="premium-final-actions">
              <a
                className="premium-button premium-whatsapp"
                href={reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => contact(offer.id, "final")}
              >
                <WhatsAppIcon />
                Consultar mi reserva
                <ArrowUpRight aria-hidden="true" />
              </a>
              <button
                className="premium-brief-trigger"
                onClick={showBrief}
                aria-controls="premium-brief"
              >
                <FileText aria-hidden="true" />
                Solicitar cotización por correo
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
        <RoicasServices />
        <section
          id="premium-brief"
          ref={briefAnchor}
          tabIndex={-1}
          className="premium-brief"
          aria-label="Solicita una cotización por correo"
        >
          <div className="premium-shell">
            <QuotationForm />
          </div>
        </section>
      </main>
      <FloatingWhatsApp
        href={reservationUrl}
        onContact={() => contact(offer.id, "floating_whatsapp")}
      />
      <PlanFooter onStart={showBrief} logoSrc="/products/web-express/images/webexpress-gold-logo.webp" />
      <Toaster position="top-center" richColors />
    </div>
  );
}
function FeatureIllustration({ type }: { type: string }) {
  const images: Record<string, string> = {
    browser: "/products/web-express/images/benefit-share.webp",
    domain: "/products/web-express/images/benefit-presence.webp",
    contact: "/products/web-express/images/benefit-content.webp",
  };
  return (
    <img
      className="premium-benefit-art"
      src={images[type]}
      alt=""
      width="360"
      height="360"
      loading="lazy"
      decoding="async"
    />
  );
}

function CampaignTicker() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className="premium-campaign-strip"
      data-paused={paused}
      aria-label="Anuncios de Black November"
    >
      <p className="sr-only">
        Black November. Tu negocio, con web propia. Da el primer paso con tu web.
      </p>
      <div className="premium-news-track" aria-hidden="true">
        {[0, 1].map((group) => (
          <div className="premium-news-group" key={group}>
            {[0, 1, 2, 3].map((sequence) => (
              <span className="premium-news-sequence" key={sequence}>
                <span>BLACK NOVEMBER</span>
                <Sparkles />
                <span>TU NEGOCIO, CON WEB PROPIA</span>
                <Sparkles />
                <span>DA EL PRIMER PASO CON TU WEB</span>
                <Sparkles />
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        className="premium-news-control"
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={paused ? "Reanudar cinta de anuncios" : "Pausar cinta de anuncios"}
        title={paused ? "Reanudar" : "Pausar"}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </button>
    </section>
  );
}

function CampaignStamp() {
  return (
    <img
      className="premium-campaign-stamp"
      src="/products/web-express/images/black-november-badge.webp"
      width="960"
      height="316"
      alt="Black November"
      decoding="async"
    />
  );
}

function FirstStepForm({ offerId, totalLabel }: { offerId: string; totalLabel: string }) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  return (
    <form
      className="premium-first-step"
      onSubmit={(event) => {
        event.preventDefault();
        const who = name.trim() ? `Soy ${name.trim()}. ` : "";
        const what = business.trim() ? `Mi negocio es: ${business.trim()}. ` : "";
        const url = getWhatsAppUrl(
          "general",
          `Hola Roicas, ${who}${what}Vi la One Page de Black November por ${totalLabel} y quiero dar el primer paso para tener mi web.`,
        );
        contact(offerId, "first_step");
        window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <p className="premium-first-step-title">Da el primer paso en 1 minuto</p>
      <div className="premium-first-step-fields">
        <input
          type="text"
          name="nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tu nombre"
          aria-label="Tu nombre"
          autoComplete="given-name"
          maxLength={60}
        />
        <input
          type="text"
          name="negocio"
          value={business}
          onChange={(event) => setBusiness(event.target.value)}
          placeholder="¿A qué se dedica tu negocio?"
          aria-label="¿A qué se dedica tu negocio?"
          maxLength={100}
        />
        <button type="submit">
          <WhatsAppIcon />
          Empezar por WhatsApp
        </button>
      </div>
      <small>Sin compromiso: te respondemos por WhatsApp y te orientamos.</small>
    </form>
  );
}

function FloatingWhatsApp({ href, onContact }: { href: string; onContact: () => void }) {
  return (
    <div className="premium-floating-whatsapp">
      <span className="premium-floating-whatsapp-prompt">¿Listo para tener tu web?</span>
      <a
        className="premium-floating-whatsapp-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cotizar mi página web por WhatsApp"
        onClick={onContact}
      >
        <WhatsAppIcon />
        <span>Escríbenos</span>
      </a>
    </div>
  );
}
