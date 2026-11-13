import * as Tabs from "@radix-ui/react-tabs";
import { ArrowDown, ArrowRight, Check, ChevronDown, ScanSearch, FileText, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import "./diseno-web.css";
import "./service-pages.css";

const canonical = "/servicios/seo";
const description = "SEO para empresas en Colombia. Auditoría técnica, investigación de búsquedas, contenido, SEO local y seguimiento de la visibilidad orgánica.";
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SEO y posicionamiento web",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description,
  areaServed: "CO",
  url: `https://roicas.com${canonical}`,
};

const capabilities = [
  {
    id: "tecnico",
    label: "Base técnica",
    icon: ScanSearch,
    title: "Páginas que Google pueda leer",
    description: "Revisamos indexación, errores, velocidad, estructura de URLs y Core Web Vitals. Priorizamos cambios para que el sitio sea más fácil de recorrer y entender.",
    items: ["Revisión de indexación","Velocidad y estructura","Prioridades técnicas"],
  },
  {
    id: "contenido",
    label: "Contenido",
    icon: FileText,
    title: "Una página para cada necesidad",
    description: "Investigamos qué buscan tus clientes. Ajustamos títulos, textos y enlaces internos, y definimos qué páginas, guías y enlaces externos conviene trabajar.",
    items: ["Búsquedas relevantes","Páginas y recursos","Enlaces de calidad"],
  },
  {
    id: "local",
    label: "SEO local",
    icon: MapPin,
    title: "Visibilidad en tu zona",
    description: "Cuando atiendes una ciudad o región, revisamos el Perfil de Empresa en Google y la información local de tu sitio.",
    items: ["Perfil de Empresa","Información local","Páginas por servicio"],
  },
];

const method = [
  {
    title: "Auditamos el sitio",
    description: "Revisamos su estado y las búsquedas del sector para detectar qué cambios priorizar.",
    deliverable: "Diagnóstico y prioridades",
  },
  {
    title: "Trabajamos las páginas",
    description: "Acordamos ajustes técnicos, contenido y enlaces. La estrategia local se incorpora cuando aplica.",
    deliverable: "Plan e implementación según alcance",
  },
  {
    title: "Medimos la evolución",
    description: "Revisamos posiciones, tráfico orgánico y oportunidades. Si el alcance contempla seguimiento continuo, incorporamos ajustes e informes periódicos.",
    deliverable: "Seguimiento e informe según alcance",
  },
];

const faqs = [
  {
    question: "¿Cuánto tarda en verse el avance?",
    answer: "Depende del estado del sitio, la competencia y el alcance. Evaluamos la evolución durante varios meses y definimos los indicadores tras la auditoría.",
  },
  {
    question: "¿El SEO reemplaza la publicidad paga?",
    answer: "Se pueden combinar. El SEO trabaja la visibilidad orgánica y las campañas permiten invertir en búsquedas o audiencias concretas.",
  },
  {
    question: "¿Garantizan el primer puesto en Google?",
    answer: "Las posiciones dependen de la búsqueda, la competencia y Google. Nuestro compromiso se centra en el trabajo técnico, de contenido y de seguimiento acordado.",
  },
  {
    question: "¿Trabajan SEO local?",
    answer: "Sí. Si atiendes una zona concreta, revisamos el Perfil de Empresa en Google y cómo presenta tu sitio esa ubicación y tus servicios.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function SEO() {
  const { openBooking } = useBooking();
  const book = () => {
    trackCtaClicked("Agendar consultoría", "servicio-seo");
    openBooking();
  };

  return (
    <>
      <SeoHead title="Agencia SEO en Colombia | Posicionamiento Web | ROICAS" description={description} canonical={canonical}
        schemaJson={[serviceSchema, faqSchema]} />
      <Header />
      <main id="contenido-principal" className="roicas-web-design roicas-service-page">
        <section className="rwd-hero rsp-hero rsp-service-hero rsp-image-hero rsp-seo-hero" aria-labelledby="service-title">
          <ParticlesBackground particleCount={24} speed={0.22} />
          <div className="section-container rwd-hero-layout rsp-hero-content">
            <div>
              <h1 id="service-title">Agencia SEO <span>en Colombia.</span></h1>
              <p className="rwd-hero-description">Ayudamos a que Google entienda tu sitio y a que tus clientes encuentren páginas que responden a sus búsquedas.</p>
              <picture className="rsp-mobile-hero-image">
                <source media="(max-width: 767px)" srcSet="/images/services/hero-seo-mobile.webp" />
                <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Ilustración del posicionamiento en buscadores y crecimiento web." width={1080} height={1080} loading="lazy" decoding="async" />
              </picture>
              <div className="rwd-actions">
                <button className="rwd-button rwd-button-light" type="button" onClick={book}>
                  Agendar consultoría <ArrowRight size={18} aria-hidden="true" />
                </button>
                <a className="rwd-link" href="#alcance">
                  Ver qué incluye <ArrowDown size={17} aria-hidden="true" />
                </a>
              </div>
              <p className="rwd-note">Consultoría gratuita · 20 minutos</p>
            </div>
          </div>
        </section>

        <section id="alcance" className="rwd-section rwd-technology" aria-labelledby="service-scope">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="service-scope">Qué trabajamos en SEO</h2>
              <p>El trabajo parte de tu sitio y de las búsquedas de tus clientes. Revisamos la base técnica, las páginas y la visibilidad local según tu alcance.</p>
            </div>
            <Tabs.Root defaultValue={capabilities[0].id} className="rwd-connections">
              <Tabs.List className="rwd-connection-tabs rsp-tabs" aria-label="Qué trabajamos en SEO">
                {capabilities.map(({ id, label, icon: Icon }) => (
                  <Tabs.Trigger className="rwd-connection-tab" key={id} value={id}>
                    <Icon size={19} aria-hidden="true" /> {label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {capabilities.map(({ id, title, description, items }) => (
                <Tabs.Content forceMount className="rwd-connection-panel" key={id} value={id}>
                  <div className="rwd-connection-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ul className="rsp-capabilities">
                    {items.map(item => (
                      <li key={item}><Check size={17} aria-hidden="true" /> {item}</li>
                    ))}
                  </ul>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </section>

        <section id="metodologia" className="rwd-section" aria-labelledby="service-method">
          <div className="section-container">
            <div className="rwd-section-heading"><h2 id="service-method">Cómo trabajamos</h2></div>
            <ol className="rwd-method-grid rsp-method">
              {method.map(({ title, description, deliverable }) => (
                <li className="rwd-method-step" key={title}>
                  <div className="rwd-step-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <p className="rwd-deliverable"><Check size={17} aria-hidden="true" /> <strong>{deliverable}</strong></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rwd-section rsp-faq-section" aria-labelledby="service-faq">
          <div className="section-container rwd-split rwd-faq">
            <div className="rwd-section-heading">
              <h2 id="service-faq">Preguntas frecuentes</h2>
              <ul className="rsp-related" aria-label="Servicios relacionados">
                <li><Link className="rwd-link" to="/servicios/diseno-web">Mejorar mi sitio web <ArrowRight size={16} aria-hidden="true" /></Link></li>
                <li><Link className="rwd-link" to="/servicios/publicidad-digital">Explorar publicidad digital <ArrowRight size={16} aria-hidden="true" /></Link></li>
              </ul>
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

        <section className="rwd-section rwd-close" aria-labelledby="service-contact">
          <div className="section-container rwd-close-layout">
            <div>
              <h2 id="service-contact">Revisemos tu sitio y sus búsquedas</h2>
              <p>Cuéntanos qué ofreces, dónde atiendes y qué páginas te interesa que encuentren tus clientes.</p>
            </div>
            <div className="rwd-actions">
              <button className="rwd-button rwd-button-light" type="button" onClick={book}>
                  Agendar consultoría <ArrowRight size={18} aria-hidden="true" />
                </button>
              <Link className="rwd-link" to="/contacto">Enviar consulta <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
