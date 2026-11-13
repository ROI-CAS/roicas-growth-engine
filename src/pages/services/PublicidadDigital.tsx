import * as Tabs from "@radix-ui/react-tabs";
import { ArrowDown, ArrowRight, Check, ChevronDown, Search, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import "./diseno-web.css";
import "./service-pages.css";

const canonical = "/servicios/publicidad-digital";
const description = "Gestionamos campañas de Google Ads y Meta Ads en Colombia. Estrategia, anuncios, medición y ajustes según los objetivos de tu empresa.";
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Gestión de Google Ads y Meta Ads",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description,
  areaServed: "CO",
  url: `https://roicas.com${canonical}`,
};

const capabilities = [
  {
    id: "google",
    label: "Google Ads",
    icon: Search,
    title: "Alcanza a quien ya está buscando",
    description: "Según tu oferta, configuramos campañas de búsqueda, Shopping, Performance Max o remarketing. Preparamos los anuncios y sus extensiones para llevar a la página adecuada.",
    items: ["Búsqueda y Shopping","Performance Max","Remarketing y extensiones"],
  },
  {
    id: "meta",
    label: "Meta Ads",
    icon: Megaphone,
    title: "Presenta tu oferta a nuevas audiencias",
    description: "Creamos anuncios para Facebook e Instagram. Según el objetivo, usamos formularios de captación, campañas de conversión o audiencias basadas en interacciones previas.",
    items: ["Facebook e Instagram","Formularios de captación","Remarketing y audiencias similares"],
  },
];

const method = [
  {
    title: "Definimos objetivo y presupuesto",
    description: "Acordamos la acción que queremos medir, el público y los canales. La inversión en pauta se plantea por separado de la gestión.",
    deliverable: "Plan de campaña",
  },
  {
    title: "Preparamos anuncios y medición",
    description: "Redactamos y diseñamos las piezas, configuramos las campañas y verificamos los eventos. Revisamos que la página o el formulario cumpla su función.",
    deliverable: "Campañas y eventos configurados",
  },
  {
    title: "Revisamos y ajustamos",
    description: "Evaluamos inversión, consultas, coste por contacto y ventas atribuidas cuando la integración las registra. Usamos los datos para ajustar anuncios, pujas y audiencias.",
    deliverable: "Seguimiento y decisiones de ajuste",
  },
];

const faqs = [
  {
    question: "¿Cuánto presupuesto necesito?",
    answer: "Lo definimos según el sector, el objetivo, la competencia y el canal. La propuesta distingue el presupuesto de pauta de los honorarios de gestión.",
  },
  {
    question: "¿Crean los anuncios o solo los gestionan?",
    answer: "Podemos trabajar estrategia, redacción, piezas gráficas, configuración, seguimiento y ajustes. Los entregables se acuerdan antes de iniciar.",
  },
  {
    question: "¿Cómo cobran la gestión?",
    answer: "Los honorarios de gestión son independientes de lo que inviertes en las plataformas. Se detallan en la propuesta según el alcance.",
  },
  {
    question: "¿Qué pasa si los anuncios no convierten?",
    answer: "Revisamos si hay problemas en el anuncio, la audiencia, la medición o la página de destino. Priorizamos ajustes y comprobamos su efecto con los datos disponibles.",
  },
];

export default function PublicidadDigital() {
  const { openBooking } = useBooking();
  const book = () => {
    trackCtaClicked("Agendar consultoría", "servicio-publicidaddigital");
    openBooking();
  };

  return (
    <>
      <SeoHead title="Publicidad Digital Google Ads y Meta Ads Colombia | ROICAS" description={description} canonical={canonical}
        schemaJson={serviceSchema} />
      <Header />
      <main id="contenido-principal" className="roicas-web-design roicas-service-page">
        <section className="rwd-hero rsp-hero" aria-labelledby="service-title">
          <ParticlesBackground particleCount={24} speed={0.22} />
          <div className="section-container rwd-hero-layout rsp-hero-content">
            <div>
              <h1 id="service-title">Publicidad digital <span>en Colombia.</span></h1>
              <p className="rwd-hero-description">Gestionamos campañas en Google Ads y Meta Ads. Preparamos los anuncios y medimos qué acciones generan según tu objetivo.</p>
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
            <img className="rwd-hero-image rsp-hero-image" src={"/images/pillars/process-step-1-estrategia.webp"} alt="Personas reunidas con portátiles y notas de trabajo"
              width={800} height={450} fetchPriority="high" decoding="async" />
          </div>
        </section>

        <section id="alcance" className="rwd-section rwd-technology" aria-labelledby="service-scope">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="service-scope">Qué canal conviene a tu campaña</h2>
              <p>Google y Meta pueden trabajar objetivos distintos. Revisamos tu oferta, la forma en que el cliente decide y los recursos disponibles.</p>
            </div>
            <Tabs.Root defaultValue={capabilities[0].id} className="rwd-connections">
              <Tabs.List className="rwd-connection-tabs rsp-tabs" aria-label="Qué canal conviene a tu campaña">
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
                <li><Link className="rwd-link" to="/servicios/diseno-web">Mejorar la página de destino <ArrowRight size={16} aria-hidden="true" /></Link></li>
                <li><Link className="rwd-link" to="/servicios/seo">Trabajar visibilidad orgánica <ArrowRight size={16} aria-hidden="true" /></Link></li>
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
              <h2 id="service-contact">Definamos qué debe lograr tu campaña</h2>
              <p>Hablemos de lo que vendes, tu presupuesto y cómo quieres medir las consultas o ventas que llegan de la pauta.</p>
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
