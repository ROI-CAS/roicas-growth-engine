import { CAMPAIGN_NAVIGATION } from "@/modules/web-express/lib/campaign-navigation";
import { useState } from "react";
import {
  ArrowRight,
  PanelsTopLeft,
  Globe,
  MapPin,
  BarChart3,
  Sparkles,
  ClipboardList,
  MonitorCheck,
  Rocket,
  ShieldCheck,
  CreditCard,
  Check,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Reveal } from "@/modules/web-express/components/Reveal";
import { WhatsAppIcon } from "@/modules/web-express/components/WhatsAppIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/web-express/components/ui/accordion";
import { DEMO_URL } from "@/modules/web-express/lib/site";
import { useLandingOffer } from "@/modules/web-express/lib/landing-offer";
import { track } from "@/modules/web-express/lib/meta";


const benefits = [
  {
    icon: PanelsTopLeft,
    title: "Una página, hasta 5 secciones",
    text: "Diseño profesional adaptado a celular, tablet y computador.",
  },
  {
    icon: Globe,
    title: "Dominio .com + hosting",
    text: "Primer año incluido, con conexión segura HTTPS.",
  },
  {
    icon: WhatsAppIcon,
    title: "Contacto por WhatsApp",
    text: "Botón directo a tu número y enlaces a tus redes sociales.",
    green: true,
  },
  {
    icon: Sparkles,
    title: "Textos e imágenes de apoyo",
    text: "Si te falta contenido, te ayudamos a prepararlo para tu negocio.",
  },
  {
    icon: MapPin,
    title: "Google Maps + formulario",
    text: "Tu ubicación y un canal para recibir solicitudes por correo.",
  },
  {
    icon: BarChart3,
    title: "Google Analytics + SEO básico",
    text: "Medición de visitas y estructura básica para buscadores.",
  },
];
function Intro({ label, title, text }: { label: string; title: string; text?: string }) {
  return (
    <Reveal className="plan-intro">
      <span className="plan-eyebrow">{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
export function PlanIncludes() {
  const offer = useLandingOffer();
  return (
    <section id="incluye" className="plan-section plan-includes">
      <div className="plan-shell plan-split">
        <Intro
          label={offer.campaign ? "Qué incluye la One Page" : "Qué incluye tu página web"}
          title={
            offer.campaign
              ? "Tu One Page, lista para presentar tu negocio"
              : "Todo lo que necesitas, en un solo plan"
          }
          text="Una presencia profesional, con lo esencial para presentar tu negocio y facilitar el contacto."
        />
        <div className="plan-benefits">
          {benefits.map(({ icon: Icon, title, text, green }, i) => (
            <Reveal
              key={title}
              delay={Math.min(i * 40, 160)}
              className={`plan-benefit${green ? " is-green" : ""}`}
            >
              <span className="plan-icon">
                <Icon className="plan-svg" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        <p className="plan-note">
          <Check aria-hidden="true" /> Incluye una ronda de ajustes. Dominio sujeto a
          disponibilidad; renovación desde el segundo año al costo del proveedor.
        </p>
      </div>
    </section>
  );
}
export function PlanSteps() {
  const offer = useLandingOffer();
  const steps = [
    {
      icon: ClipboardList,
      title: "Nos cuentas tu idea",
      text: "Envías los datos de tu negocio y el anticipo. Si te falta contenido, te orientamos.",
    },
    {
      icon: MonitorCheck,
      title: "Diseñamos y revisamos",
      text: "Adaptamos el diseño a tu negocio y comprobamos que funcione en celular y computador.",
    },
    {
      icon: Rocket,
      title: "Revisas, apruebas y publicamos",
      text: offer.campaign
        ? "Recibes la propuesta en el plazo acordado. Hacemos los ajustes incluidos y, con tu aprobación y el saldo, publicamos."
        : "Recibes la propuesta en 24 horas hábiles. Hacemos los ajustes incluidos y, con tu aprobación y el saldo, publicamos.",
    },
  ];
  return (
    <section id="proceso" className="plan-section plan-process">
      <div className="plan-shell plan-split">
        <Intro
          label="Cómo funciona"
          title={
            offer.campaign
              ? "Tu One Page, en tres pasos claros"
              : "Tu página web, en tres pasos claros"
          }
        />
        <ol className="plan-steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 60} className="plan-step">
              <div className="plan-step-top">
                <span className="plan-number">{i + 1}</span>
                <span className="plan-icon">
                  <Icon aria-hidden="true" />
                </span>
                {i < 2 && <ArrowRight className="plan-connector" aria-hidden="true" />}
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </ol>
        <p className="plan-note">
          El plazo empieza al recibir el brief completo. No incluye fines de semana, festivos ni el
          tiempo que tardes en revisar y aprobar.
        </p>
      </div>
    </section>
  );
}
export function PlanPricing({ onCta, onBooking }: { onCta: () => void; onBooking: () => void }) {
  const offer = useLandingOffer();
  return (
    <section id="precio" className="plan-offer">
      <div className="plan-shell">
        <div className="plan-offer-grid">
          <Reveal className="plan-offer-heading">
            <span className="plan-eyebrow">
              {offer.campaign ? "One Page · Black November" : "Plan Web Express"}
            </span>
            <h2>
              {offer.campaign
                ? "Tu One Page durante noviembre por"
                : "Tu página web profesional por"}{" "}
              <strong>{offer.totalLabel}</strong>
            </h2>
            <p>Un precio total, pagado en dos partes. Dominio y hosting incluidos el primer año.</p>
            {offer.campaign && (
              <p className="campaign-price-caption">
                Válido hasta el 27 de noviembre de 2026, hora Colombia.
              </p>
            )}
          </Reveal>
          <Reveal delay={60} className="plan-payments">
            <div>
              <span className="plan-icon">
                <CreditCard aria-hidden="true" />
              </span>
              <p>
                <strong>50% para empezar</strong>
                <span>{offer.depositLabel} de anticipo</span>
              </p>
            </div>
            <div>
              <span className="plan-icon">
                <Check aria-hidden="true" />
              </span>
              <p>
                <strong>50% al aprobar tu página</strong>
                <span>{offer.depositLabel} antes de publicar</span>
              </p>
            </div>
            <div id="garantia">
              <span className="plan-icon">
                <ShieldCheck aria-hidden="true" />
              </span>
              <p>
                <strong>Compromiso de entrega</strong>
                <span>
                  Devolución del anticipo si incumplimos el plazo por una causa atribuible a
                  nosotros. <a href={offer.termsHref}>Consulta las condiciones.</a>
                </span>
              </p>
            </div>
          </Reveal>
          <div className="plan-offer-actions">
            <a
              className="plan-button plan-whatsapp"
              href={offer.whatsappUrl("pricing")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("Contact")}
            >
              <WhatsAppIcon />
              Cotizar por WhatsApp
              <ArrowRight />
            </a>
            <a
              className="plan-button plan-wompi"
              href={offer.checkoutUrl ?? offer.whatsappUrl("payment")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track(offer.checkoutUrl ? "InitiateCheckout" : "Contact", {
                  ...(offer.checkoutUrl ? { value: offer.depositCOP, currency: "COP" } : {}),
                  params: { campaign: offer.id, placement: "pricing", intent: "payment" },
                })
              }
            >
              <CreditCard aria-hidden="true" />{" "}
              {offer.checkoutUrl
                ? `Pagar ${offer.depositLabel} con Wompi`
                : "Solicitar enlace Wompi"}{" "}
              <ArrowRight aria-hidden="true" />
            </a>
            <p className="plan-payment-caption">
              <ShieldCheck aria-hidden="true" />{" "}
              {offer.checkoutUrl
                ? "Pago a través de Wompi · PSE · Nequi · Tarjetas"
                : `Solicita el enlace para el anticipo de ${offer.depositLabel}`}
            </p>
            <button type="button" className="plan-brief-link" onClick={onCta}>
              Prefiero llenar el brief <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="plan-scope">
          <p>
            ¿Necesitas una tienda online, más páginas o funciones a medida? Se cotizan por separado.
          </p>
          <button type="button" onClick={onBooking}>
            Consultar proyecto especial <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
export function PlanFAQ({ items }: { items: { q: string; a: string }[] }) {
  const offer = useLandingOffer();
  const [all, setAll] = useState(false);
  const primary = items.length > 10 ? [0, 4, 5, 7, 10] : items.slice(0, 5).map((_, index) => index);
  const displayed = all ? items : primary.map((i) => items[i]);
  return (
    <section id="faq" className="plan-section plan-faq">
      <div className="plan-shell plan-faq-grid">
        <div>
          <Intro
            label="Preguntas frecuentes"
            title="¿Tienes dudas? Vamos a resolverlas."
            text="Lo esencial para tomar una decisión con claridad."
          />
          <button
            type="button"
            className="plan-outline-button"
            aria-expanded={all}
            aria-controls="plan-questions"
            onClick={() => setAll(!all)}
          >
            {all ? "Ver preguntas principales" : "Ver todas las preguntas"}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <Reveal delay={40} className="plan-questions">
          <Accordion id="plan-questions" type="single" collapsible>
            {displayed.map((item) => (
              <AccordionItem data-slot="accordion-item" key={item.q} value={item.q}>
                <AccordionTrigger data-slot="accordion-trigger">{item.q}</AccordionTrigger>
                <AccordionContent data-slot="accordion-content">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <Reveal delay={80} className="plan-contact-card">
          <span className="plan-icon">
            <MessageCircle aria-hidden="true" />
          </span>
          <h3>¿Prefieres hablar con nosotros?</h3>
          <p>Cuéntanos qué necesita tu negocio. Te ayudamos a elegir el siguiente paso.</p>
          <a
            className="plan-button plan-whatsapp"
            href={offer.whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("Contact")}
          >
            <WhatsAppIcon />
            Hablar por WhatsApp
            <ArrowRight />
          </a>
          <span className="plan-contact-note">Atención personalizada por Roicas</span>
        </Reveal>
      </div>
    </section>
  );
}
export function PlanFooter({ onStart, logoSrc }: { onStart?: () => void; logoSrc?: string } = {}) {
  const offer = useLandingOffer();
  return (
    <footer className="plan-footer">
      <div className="plan-shell">
        <div className="plan-footer-top">
          <a href="#top" className="plan-brand">
            {logoSrc ? (
              <img
                className="premium-footer-logo"
                src={logoSrc}
                width="720"
                height="240"
                alt="WebExpress · Un producto de Roicas"
              />
            ) : (
              <>
                <span>
                  <Zap aria-hidden="true" />
                </span>
                <div>
                  <strong>Web Express {!offer.campaign && <b>24H</b>}</strong>
                  <small>Un producto de Roicas</small>
                </div>
              </>
            )}
          </a>
          <nav aria-label="Navegación del pie de página">
            {offer.campaign ? (
              <>
                {CAMPAIGN_NAVIGATION.map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ))}
                {onStart && (
                  <button type="button" onClick={onStart}>
                    Empezar mi web
                  </button>
                )}
              </>
            ) : (
              <>
                <a href={offer.campaign ? "#planes" : "#incluye"}>Qué incluye</a>
                <a href="#disenos">Ejemplos</a>
                <a href={offer.campaign ? "#planes" : "#precio"}>Precio</a>
                <a href="#faq">Preguntas</a>
                <a
                  href="#solicitar"
                  onClick={(event) => {
                    if (onStart) {
                      event.preventDefault();
                      onStart();
                    }
                  }}
                >
                  Empezar mi web
                </a>
              </>
            )}
          </nav>
          <p>Tu negocio merece una web clara, profesional y fácil de contactar.</p>
        </div>
        <div className="plan-footer-bottom">
          <span>
            © {new Date().getFullYear()} Web Express{!offer.campaign && " 24H"} · Roicas
          </span>
          <div>
            <a href={offer.campaign ? "/web-express/privacidad?from=black-november" : "/web-express/privacidad"}>
              Privacidad
            </a>
            <a href={offer.termsHref}>Términos del servicio</a>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              Ver demo <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
