import { ArrowUpRight, ChartNoAxesCombined, PanelsTopLeft, Search, Workflow } from "lucide-react";
import { Reveal } from "@/modules/web-express/components/Reveal";
import { getWhatsAppUrl } from "@/modules/web-express/lib/site";

const services = [
  {
    title: "CRM y automatización",
    text: "Organiza contactos y seguimiento comercial.",
    icon: Workflow,
  },
  {
    title: "SEO y posicionamiento",
    text: "Mejora la visibilidad de tu negocio en Google.",
    icon: Search,
  },
  {
    title: "Google Ads y Meta Ads",
    text: "Llega a personas que buscan lo que ofreces.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Rediseño de tu web",
    text: "Actualiza una página que ya no representa tu negocio.",
    icon: PanelsTopLeft,
  },
];

export function RoicasServices() {
  return (
    <section className="premium-roicas-services" aria-labelledby="roicas-services-title">
      <Reveal className="premium-shell premium-roicas-services-inner">
        <div className="premium-roicas-services-intro">
          <p className="premium-eyebrow">TAMBIÉN CON ROICAS</p>
          <h2 id="roicas-services-title">¿Necesitas algo más que una web?</h2>
          <p>Cuéntanos qué quieres mejorar. Te orientamos y cotizamos según tu negocio.</p>
          <a href="https://www.roicas.com/" target="_blank" rel="noopener noreferrer">
            Conocer Roicas <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div>
          <div className="premium-roicas-services-grid">
            {services.map(({ title, text, icon: Icon }) => (
              <a
                className="premium-roicas-service"
                key={title}
                href={getWhatsAppUrl(
                  "general",
                  `Hola Roicas, vengo de la landing Black November y quiero cotizar ${title}. Mi necesidad es: `,
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cotizar ${title} por WhatsApp`}
              >
                <Icon aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="premium-roicas-services-note">
            Servicios con cotización independiente. No incluidos en los planes Black November.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
