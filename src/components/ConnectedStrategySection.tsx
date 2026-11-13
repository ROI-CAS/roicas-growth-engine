import { Globe, Megaphone, Workflow, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ParticlesBackground from "./ui/ParticlesBackground";
import "./connected-strategy.css";

const strategicPillars = [
  {
    step: "01 · Presencia",
    category: "Diseño web y tiendas online",
    title: "Una web que representa tu negocio",
    description:
      "Diseñamos sitios web y tiendas online en WordPress concebidos para vender. Veloces, administrables y 100% de tu empresa, sin hablar en código y sin contratos de permanencia.",
    image: "/images/pillars/strategy-web-presencia.webp",
    imageAlt: "Diseño de páginas web y tiendas online en WordPress con diseño moderno y responsive",
    benefits: [
      "Carga ultrarrápida en celulares (< 1 segundo)",
      "Sin cláusulas de permanencia: dominio, hosting y código tuyos",
      "Botón de WhatsApp y formularios listos para cotizar",
    ],
    actionText: "Ver desarrollo web y tiendas",
    href: "/servicios/diseno-web",
    icon: Globe,
  },
  {
    step: "02 · Atracción",
    category: "SEO y publicidad digital en Google",
    title: "Más oportunidades de encontrarte",
    description:
      "Aparece en los primeros resultados de Google cuando buscan tus servicios en Bogotá o a nivel nacional. Campañas en Google Ads y Meta enfocadas en personas listas para comprar.",
    image: "/images/pillars/strategy-seo-ads.webp",
    imageAlt: "Estrategias de posicionamiento SEO y campañas publicitarias en Google Ads y Meta",
    benefits: [
      "Posicionamiento SEO en búsquedas comerciales clave",
      "Publicidad en Google Ads y Meta optimizada por costo",
      "Consultas de clientes con intención real de compra",
    ],
    actionText: "Ver SEO y publicidad digital",
    href: "/servicios/publicidad-digital",
    icon: Megaphone,
  },
  {
    step: "03 · Seguimiento",
    category: "WhatsApp comercial y CRM (GHL)",
    title: "Cada contacto, con seguimiento",
    description:
      "No dejes que una consulta se pierda por demoras. Conectamos tu web a WhatsApp y a flujos automatizados con GoHighLevel (GHL) CRM para atender en segundos, calificar prospectos y cerrar más ventas.",
    image: "/images/pillars/strategy-crm-ghl.webp",
    imageAlt: "Automatización de WhatsApp y pipeline de ventas centralizado en CRM GoHighLevel (GHL)",
    benefits: [
      "Botón de WhatsApp inteligente integrado en toda la web",
      "Automatización de embudos y respuestas con GoHighLevel (GHL)",
      "Pipeline comercial ordenado en CRM para cerrar ventas",
    ],
    actionText: "Ver automatización y GoHighLevel (GHL)",
    href: "/servicios/automatizacion-ia",
    icon: Workflow,
  },
];

export default function ConnectedStrategySection() {
  return (
    <section
      id="estrategia"
      className="roicas-connected-strategy relative"
      aria-labelledby="strategy-heading"
    >
      <ParticlesBackground particleCount={45} speed={0.35} className="opacity-80 z-0" />
      <div className="rcs-container relative z-10">
        {/* Encabezado con propuesta coherente y clara */}
        <header className="rcs-header">
          <div className="rcs-badge">
            <span className="rcs-badge-dot" aria-hidden="true" />
            <span>Una oferta integral · Sin piezas sueltas</span>
          </div>

          <h2 id="strategy-heading">
            Tu estrategia, <span>conectada.</span>
          </h2>

          <p className="rcs-lead">
            <strong>De la primera búsqueda al seguimiento comercial.</strong> Muchas empresas
            tienen una web aislada, pauta sin medir y consultas que tardan horas en responderse.
            En Roicas unimos cada etapa para que trabajen como un solo sistema continuo de captación y ventas con GoHighLevel (GHL).
          </p>
        </header>

        {/* 3 Pilares con imágenes de apoyo optimizadas y diseño visual premium */}
        <div className="rcs-grid">
          {strategicPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rcs-card">
                {/* Imagen de apoyo optimizada de Pexels */}
                <div className="rcs-card-visual">
                  <img
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    loading="lazy"
                    width={800}
                    height={450}
                    className="rcs-card-img"
                  />
                  <div className="rcs-card-visual-overlay" aria-hidden="true" />
                  <span className="rcs-step-pill">{pillar.step}</span>
                </div>

                <div className="rcs-card-content">
                  <div className="rcs-card-top">
                    <div className="rcs-icon-box" aria-hidden="true">
                      <Icon size={22} />
                    </div>
                    <span className="rcs-category-tag">{pillar.category}</span>
                  </div>

                  <h3>{pillar.title}</h3>
                  <p className="rcs-card-desc">{pillar.description}</p>

                  <ul className="rcs-benefits-list" aria-label={`Beneficios de ${pillar.title}`}>
                    {pillar.benefits.map((benefit) => (
                      <li key={benefit} className="rcs-benefit-item">
                        <CheckCircle2 size={16} aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={pillar.href} className="rcs-card-link">
                    <span>{pillar.actionText}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
