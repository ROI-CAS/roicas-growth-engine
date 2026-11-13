import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight, ChevronDown, Globe2, Megaphone, Workflow } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import "./solutions-interactive.css";

type DemoModule = typeof import("@/components/ui/services-interactive-huds");

function loadDemo(name: keyof DemoModule) {
  return lazy(() => import("@/components/ui/services-interactive-huds").then(
    (module) => ({ default: module[name] }),
    () => ({ default: () => <p className="rsi-demo-status" role="status">No pudimos cargar la demostración. Puedes consultar el servicio en los enlaces de arriba.</p> }),
  ));
}

const solutions = [
  {
    id: "web",
    step: "Presencia",
    tab: "Crear o mejorar mi web",
    subtitle: "Sitios web y tiendas online",
    icon: Globe2,
    title: "Una web que explique tu valor y facilite el contacto",
    description: "Diseñamos sitios y tiendas online en WordPress alrededor de tu oferta, con contenido y navegación claros para orientar a tus clientes.",
    details: ["Diseño móvil y rendimiento optimizado", "Dominio, hosting y código de tu empresa, sin permanencia", "WhatsApp y formularios listos para recibir cotizaciones"],
    links: [["Ver desarrollo web", "/servicios/diseno-web"], ["Ver tiendas online", "/servicios/tiendas-online"]],
    image: "/images/pillars/strategy-web-presencia.webp",
    imageAlt: "Diseño de un sitio web adaptable a distintos dispositivos",
    demoLabel: "Ver demo de diseño web",
    Demo: loadDemo("WebArchitectureHud"),
  },
  {
    id: "attract",
    step: "Atracción",
    tab: "Atraer clientes",
    subtitle: "SEO y publicidad digital",
    icon: Megaphone,
    title: "Que te encuentren cuando necesitan lo que ofreces",
    description: "Mejoramos tu presencia en buscadores y creamos campañas para que personas interesadas encuentren tu negocio en Bogotá o en todo el país.",
    details: ["SEO y contenido para búsquedas comerciales", "Campañas en Google Ads y Meta con optimización de costos", "Medición de consultas y rendimiento por canal"],
    links: [["Ver SEO", "/servicios/seo"], ["Ver publicidad", "/servicios/publicidad-digital"]],
    image: "/images/pillars/strategy-seo-ads.webp",
    imageAlt: "Vista de trabajo sobre visibilidad en buscadores y publicidad digital",
    demoLabel: "Ver demo de captación",
    Demo: loadDemo("SearchAcquisitionHud"),
  },
  {
    id: "follow",
    step: "Seguimiento",
    tab: "Dar seguimiento",
    subtitle: "WhatsApp y CRM GoHighLevel",
    icon: Workflow,
    title: "Que cada consulta reciba seguimiento",
    description: "Conectamos tu web, WhatsApp y GoHighLevel (GHL) para que tu equipo pueda atender consultas y avanzar cada oportunidad desde un solo lugar.",
    details: ["Contactos de WhatsApp y formularios en un solo CRM", "Respuestas y recordatorios automáticos por WhatsApp", "Calificación de contactos y seguimiento de cotizaciones"],
    links: [["Ver automatización y CRM", "/servicios/automatizacion-ia"]],
    image: "/images/pillars/strategy-crm-ghl.webp",
    imageAlt: "Vista de un flujo de atención comercial con WhatsApp y CRM",
    demoLabel: "Ver demo de seguimiento",
    Demo: loadDemo("CrmAutomationHud"),
  },
];

function SolutionPanel({ solution }: { solution: (typeof solutions)[number] }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const { title, description, details, links, image, imageAlt, demoLabel, Demo } = solution;

  return (
    <>
      <div className="rsi-panel-content">
        <div className="rsi-copy">
          <h3>{title}</h3>
          <p>{description}</p>
          <ul>
            {details.map((detail) => (
              <li key={detail}>
                <span aria-hidden="true" />
                {detail}
              </li>
            ))}
          </ul>
          <div className="rsi-panel-actions">
            {links.map(([label, href], index) => (
              <Link className={index === 0 ? "rsi-primary" : "rsi-secondary"} to={href} key={href}>
                {label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        <div className="rsi-visual">
          <img src={image} alt={imageAlt} width={800} height={450} loading="lazy" decoding="async" />
        </div>
      </div>
      <details className="rsi-demo" onToggle={(event) => setDemoOpen(event.currentTarget.open)}>
        <summary>
          <span>{demoLabel}</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        {demoOpen && (
          <Suspense fallback={<p className="rsi-demo-status" role="status">Cargando demostración…</p>}>
            <Demo />
          </Suspense>
        )}
      </details>
    </>
  );
}

export default function ServicesSection() {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateOrientation = () => setIsNarrow(media.matches);
    updateOrientation();
    media.addEventListener("change", updateOrientation);
    return () => media.removeEventListener("change", updateOrientation);
  }, []);

  return (
    <section id="servicios" className="roicas-solutions-interactive" aria-labelledby="solutions-title">
      <span id="estrategia" className="rsi-strategy-anchor" aria-hidden="true" />
      <div className="rsi-inner">
        <BlurFade inView blur="3px" offset={8} duration={0.45} className="rsi-intro">
          <div>
            <p className="rsi-eyebrow">Soluciones para tu negocio</p>
            <h2 id="solutions-title">Tu estrategia, <span>conectada</span></h2>
          </div>
          <p>Unimos tu web, la captación y el seguimiento comercial para que cada etapa lleve a la siguiente. Puedes empezar por una necesidad o trabajar la estrategia completa.</p>
        </BlurFade>

        <Tabs.Root className="rsi-tabs-container" defaultValue="web" activationMode="manual" orientation={isNarrow ? "vertical" : "horizontal"}>
          <Tabs.List className="rsi-tablist" aria-label="Qué necesita tu negocio">
            {solutions.map(({ id, step, tab, subtitle, icon: Icon }, index) => (
              <Tabs.Trigger key={id} value={id} className="rsi-tab">
                <span className="rsi-tab-icon-wrap">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="rsi-tab-body">
                  <span className="rsi-tab-step">
                    <span className="rsi-stage-dot" aria-hidden="true" />
                    0{index + 1} · {step}
                  </span>
                  <span className="rsi-tab-title">{tab}</span>
                  <span className="rsi-tab-sub">{subtitle}</span>
                </span>
                <ChevronDown size={18} className="rsi-tab-arrow" aria-hidden="true" />
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {solutions.map((solution) => (
            <Tabs.Content key={solution.id} value={solution.id} className="rsi-panel">
              <SolutionPanel solution={solution} />
            </Tabs.Content>
          ))}
        </Tabs.Root>

      </div>
    </section>
  );
}
