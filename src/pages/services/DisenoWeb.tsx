import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, ChartNoAxesCombined,
  Code2, ContactRound, Crosshair, Globe2, LayoutDashboard, Megaphone,
  MessageCircle, MousePointerClick, Network, Share2, Sparkles, Workflow,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import "./diseno-web.css";
import "./service-pages.css";

const pageDescription = "Diseño web a medida para empresas en Colombia. Desarrollamos sitios con tecnología propia o WordPress y los conectamos con redes, medición y tu CRM.";
const disenoWebSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Diseño y desarrollo web a medida",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description: pageDescription,
  areaServed: "CO",
  url: "https://roicas.com/servicios/diseno-web",
};

const connections = [
  {
    id: "desarrollo",
    label: "Desarrollo e IA",
    icon: Code2,
    title: "La tecnología se adapta al proyecto.",
    description: "Desarrollamos con tecnología propia o WordPress, según lo que necesites editar e integrar. Podemos incorporar IA para responder preguntas frecuentes o clasificar consultas antes de pasarlas al equipo.",
    flow: [
      { icon: LayoutDashboard, label: "Desarrollo a medida" },
      { icon: Sparkles, label: "Asistencia con IA" },
      { icon: ContactRound, label: "Tu equipo" },
    ],
    link: { href: "#alcance", label: "Ver qué incluye tu web" },
  },
  {
    id: "redes",
    label: "Redes sociales",
    icon: Share2,
    title: "De una publicación a una conversación.",
    description: "Conectamos la web con tus perfiles y preparamos enlaces para que quien llega desde Instagram, Facebook o una campaña encuentre el contenido adecuado y pueda seguir por WhatsApp o formulario.",
    flow: [
      { icon: Megaphone, label: "Redes o campañas" },
      { icon: Globe2, label: "Página de destino" },
      { icon: MessageCircle, label: "WhatsApp o formulario" },
    ],
    link: { href: "/servicios/publicidad-digital", label: "Ver publicidad digital" },
  },
  {
    id: "medicion",
    label: "Píxeles y medición",
    icon: Crosshair,
    title: "Entiende qué hizo la persona después del clic.",
    description: "Configuramos el píxel de Meta y eventos en Google Analytics o Google Ads, según tus canales y el consentimiento aplicable. Así puedes distinguir una visita de un formulario enviado o un clic en WhatsApp.",
    flow: [
      { icon: MousePointerClick, label: "Acción en la web" },
      { icon: Crosshair, label: "Píxel o evento" },
      { icon: ChartNoAxesCombined, label: "Medición de campaña" },
    ],
  },
  {
    id: "crm",
    label: "CRM del cliente",
    icon: Workflow,
    title: "Las consultas llegan al CRM que ya usas.",
    description: "Conectamos los formularios con tu CRM cuando admite integración. Así, tu equipo puede recibir los datos de la consulta, asignar un responsable y continuar el seguimiento desde su herramienta habitual.",
    flow: [
      { icon: MessageCircle, label: "Consulta web" },
      { icon: Network, label: "Integración" },
      { icon: ContactRound, label: "Tu CRM" },
    ],
    link: { href: "/servicios/automatizacion-ia", label: "Ver automatización y CRM" },
  },
];

const scope = [
  {
    title: "Estructura y contenido",
    items: [
      "Mapa del sitio y recorrido hasta el contacto.",
      "Textos y diseño a medida para inicio, servicios, equipo y contacto, según el proyecto.",
      "Blog o sección de recursos, si lo necesitas.",
    ],
  },
  {
    title: "Diseño y desarrollo",
    items: [
      "Desarrollo con tecnología propia o WordPress, adaptado a móvil y escritorio.",
      "Optimización de imágenes, carga y Core Web Vitals.",
      "Certificado SSL, seguridad inicial y formación para editar el sitio.",
    ],
  },
  {
    title: "Captación y medición",
    items: [
      "SEO técnico para preparar el sitio para Google, con títulos, enlaces y mapa del sitio.",
      "Formularios, WhatsApp, redes sociales y conexión con tu CRM según el alcance.",
      "Google Analytics y píxeles para medir las acciones de contacto acordadas.",
    ],
  },
];

const method = [
  {
    phase: "Estrategia",
    title: "Definimos qué debe resolver tu web",
    description: "Revisamos tus servicios, el sitio actual si lo tienes y cómo te contactan tus clientes. Acordamos las páginas, el objetivo y las fechas antes de diseñar.",
    deliverable: "Propuesta de alcance y mapa del sitio",
    image: "/images/pillars/process-step-1-estrategia.webp",
    alt: "Equipo reunido para definir la estrategia de un proyecto digital",
  },
  {
    phase: "Construcción",
    title: "Diseñamos, construimos y probamos",
    description: "Construimos el sitio con la tecnología acordada y te compartimos una vista privada. Allí puedes revisar el contenido y la navegación mientras probamos los formularios y las integraciones.",
    deliverable: "Vista previa para revisar y aprobar",
    image: "/images/pillars/process-step-2-construccion.webp",
    alt: "Puesto de trabajo con pantallas de desarrollo web",
  },
  {
    phase: "Lanzamiento",
    title: "Publicamos y te entregamos el control",
    description: "Comprobamos la web publicada, las rutas de contacto y la medición acordada. Te entregamos los accesos y te enseñamos a editar el contenido.",
    deliverable: "Sitio publicado, accesos y formación",
    image: "/images/pillars/process-step-3-lanzamiento.webp",
    alt: "Equipo revisando un proyecto en un portátil",
  },
];

const faqs = [
  {
    question: "¿Cuánto tarda un proyecto de diseño web?",
    answer: "Un proyecto suele tomar entre 3 y 6 semanas, según las páginas, el contenido y las integraciones. Acordamos el calendario en la propuesta.",
  },
  {
    question: "¿Puedo editar mi web después de la entrega?",
    answer: "Sí. Definimos qué contenido necesita editar tu equipo y te enseñamos a actualizarlo desde el panel que corresponda al proyecto.",
  },
  {
    question: "¿El precio incluye el hosting?",
    answer: "El alojamiento se contrata aparte. Te asesoramos para elegir un plan adecuado al tamaño y presupuesto del proyecto.",
  },
  {
    question: "¿Qué soporte ofrecen después del lanzamiento?",
    answer: "La propuesta detalla el acompañamiento de entrega. Si necesitas soporte continuo, ofrecemos planes de mantenimiento con actualizaciones, copias de seguridad y revisión del sitio.",
  },
];

export default function DisenoWeb() {
  const { openBooking } = useBooking();
  const book = () => {
    trackCtaClicked("Agendar consultoría", "servicio-disenoweb");
    openBooking();
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Diseño web a medida para empresas en Colombia | ROICAS"
        description={pageDescription}
        canonical="/servicios/diseno-web"
        schemaJson={disenoWebSchema}
      />
      <Header />

      <main id="contenido-principal" className="roicas-web-design">
        <section className="rwd-hero rsp-hero" aria-labelledby="web-title">
          <ParticlesBackground particleCount={24} speed={0.22} />
          <div className="section-container rwd-hero-layout rsp-hero-content">
            <div>
              <p className="rwd-label">Diseño web e integraciones</p>
              <h1 id="web-title">Diseño web para <span>empresas en Colombia.</span></h1>
              <p className="rwd-hero-description">Construimos sitios a medida y los conectamos con tus redes, tu medición y el CRM que ya usa tu equipo.</p>
              <div className="rwd-actions">
                <button className="rwd-button rwd-button-light" type="button" onClick={book}>
                  Agendar consultoría <ArrowRight size={18} aria-hidden="true" />
                </button>
                <a className="rwd-link" href="#conexiones">Explorar conexiones <ArrowDown size={17} aria-hidden="true" /></a>
              </div>
              <p className="rwd-note">Consultoría gratuita · 20 minutos</p>
            </div>
            <img
              className="rwd-hero-image"
              src="/images/pillars/strategy-web-presencia.webp"
              alt="Dos monitores con páginas web en proceso de diseño"
              width={800}
              height={450}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </section>

        <section id="conexiones" className="rwd-section rwd-technology" aria-labelledby="web-technology-title">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="web-technology-title">Tu web conecta con las herramientas de tu negocio.</h2>
              <p>Explora cómo puedes atraer visitas desde redes, medir qué hacen y dar seguimiento a las consultas desde tu CRM.</p>
            </div>
            <Tabs.Root defaultValue="desarrollo" activationMode="manual" className="rwd-connections">
              <Tabs.List className="rwd-connection-tabs" aria-label="Conexiones del sitio web">
                {connections.map(({ id, label, icon: Icon }) => (
                  <Tabs.Trigger key={id} value={id} className="rwd-connection-tab">
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                    <span>{label}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {connections.map(({ id, title, description, flow, link }) => (
                <Tabs.Content key={id} value={id} forceMount className="rwd-connection-panel">
                  <div className="rwd-connection-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    {link && <a className="rwd-link" href={link.href}>{link.label} <ArrowRight size={16} aria-hidden="true" /></a>}
                  </div>
                  <ol className="rwd-connection-flow" aria-label="Ejemplo de conexión">
                    {flow.map(({ label, icon: Icon }) => (
                      <li key={label}>
                        <span className="rwd-flow-icon"><Icon size={25} strokeWidth={1.65} aria-hidden="true" /></span>
                        <span>{label}</span>
                      </li>
                    ))}
                  </ol>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </section>

        <section id="alcance" className="rwd-section" aria-labelledby="web-scope-title">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="web-scope-title">Qué incluye tu sitio web.</h2>
              <p>La propuesta detalla las páginas, los contenidos y las integraciones que necesita tu empresa.</p>
              <a className="rwd-link" href="/servicios/seo">Conocer el servicio de SEO <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="rwd-scope-grid">
              {scope.map(({ title, items }) => (
                <article key={title} className="rwd-scope-item">
                  <h3>{title}</h3>
                  <ul>
                    {items.map((item) => <li key={item}><Check size={18} aria-hidden="true" /><span>{item}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metodologia" className="rwd-section rwd-method" aria-labelledby="web-method-title">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="web-method-title">Cómo trabajamos tu proyecto.</h2>
              <p>Acordamos el alcance, revisas la web antes de publicarla y recibes los accesos al terminar.</p>
            </div>
            <ol className="rwd-method-grid">
              {method.map(({ phase, title, description, deliverable, image, alt }) => (
                <li className="rwd-method-step" key={phase}>
                  <img src={image} alt={alt} width={800} height={450} loading="lazy" decoding="async" />
                  <div className="rwd-step-copy">
                    <p className="rwd-label">{phase}</p>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <p className="rwd-deliverable"><Check size={17} aria-hidden="true" /><strong>{deliverable}</strong></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rwd-section" aria-labelledby="web-faq-title">
          <div className="section-container rwd-split rwd-faq">
            <div className="rwd-copy">
              <h2 id="web-faq-title">Antes de empezar.</h2>
              <p>Resuelve dudas sobre plazos, edición, alojamiento y soporte.</p>
            </div>
            <div>
              {faqs.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question} <ChevronDown size={19} aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rwd-section rwd-close" aria-labelledby="web-contact-title">
          <div className="section-container rwd-close-layout">
            <div>
              <h2 id="web-contact-title">Hablemos de tu web.</h2>
              <p>En una consultoría gratuita de 20 minutos revisamos qué necesitas y cuál sería el primer paso.</p>
            </div>
            <div className="rwd-actions">
              <button className="rwd-button rwd-button-light" type="button" onClick={book}>
                Agendar consultoría <ArrowRight size={18} aria-hidden="true" />
              </button>
              <a className="rwd-link" href="/contacto">Enviar consulta <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
