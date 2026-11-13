import * as Tabs from "@radix-ui/react-tabs";
import { ArrowDown, ArrowRight, Check, ChevronDown, MessageCircle, Workflow, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import "./diseno-web.css";
import "./service-pages.css";

const canonical = "/servicios/automatizacion-ia";
const description = "Automatizamos la atención y el seguimiento comercial con IA, WhatsApp y CRM. Configura respuestas, asignación y recordatorios según tu operación.";
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Automatización con IA y CRM",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description,
  areaServed: "CO",
  url: `https://roicas.com${canonical}`,
};

const capabilities = [
  {
    id: "atencion",
    label: "Atención",
    icon: MessageCircle,
    title: "Recibe y orienta cada consulta",
    description: "Configuramos agentes con tus servicios, respuestas frecuentes y preguntas de clasificación. Los casos que requieren revisión pasan a una persona según las reglas acordadas.",
    items: ["Preguntas frecuentes","Clasificación inicial","Derivación al equipo"],
  },
  {
    id: "crm",
    label: "Asignación y agenda",
    icon: Workflow,
    title: "Organiza la oportunidad en tu CRM",
    description: "Según las integraciones disponibles, registramos datos de la consulta, asignamos responsables y conectamos recordatorios o agenda.",
    items: ["Registro en CRM","Asignación","Agenda y notificaciones"],
  },
  {
    id: "seguimiento",
    label: "Seguimiento",
    icon: BellRing,
    title: "Seguimiento con reglas claras",
    description: "Configuramos seguimientos, mensajes de bienvenida, reactivación o solicitud de reseñas. Elegimos canales y momentos según tu operación y permisos.",
    items: ["WhatsApp, correo o SMS","Bienvenida y reactivación","Solicitud de reseñas"],
  },
];

const method = [
  {
    title: "Mapeamos tu atención",
    description: "Revisamos por dónde llegan las consultas, qué información pide tu equipo y en qué casos necesita intervenir.",
    deliverable: "Mapa del flujo y reglas",
  },
  {
    title: "Conectamos y probamos",
    description: "Configuramos los canales, el CRM y las respuestas acordadas. Probamos casos frecuentes, agenda, derivación y excepciones.",
    deliverable: "Flujo probado antes de activar",
  },
  {
    title: "Activamos y ajustamos",
    description: "Revisamos conversaciones, asignaciones y tareas. Acordamos qué ajustes y seguimiento incluye el servicio.",
    deliverable: "Flujo activo y pautas de uso",
  },
];

const faqs = [
  {
    question: "¿Mi equipo necesita conocimientos técnicos?",
    answer: "Configuramos los flujos y revisamos contigo los mensajes, accesos y reglas. Tu equipo valida los casos y mantiene el control de las decisiones comerciales.",
  },
  {
    question: "¿Con qué canales puede funcionar?",
    answer: "Podemos trabajar con WhatsApp Business, correo, SMS y chat web. Definimos los canales según tus herramientas, permisos y alcance.",
  },
  {
    question: "¿Se puede conectar a mi CRM actual?",
    answer: "Revisamos qué integraciones y accesos ofrece tu CRM. Si el proyecto lo requiere, también podemos evaluar GoHighLevel.",
  },
  {
    question: "¿Qué ocurre si el agente no puede resolver una consulta?",
    answer: "El flujo puede derivar la conversación a tu equipo. El contexto que recibe la persona depende de los datos y las integraciones disponibles.",
  },
];

export default function AutomatizacionIA() {
  const { openBooking } = useBooking();
  const book = () => {
    trackCtaClicked("Agendar consultoría", "servicio-automatizacionia");
    openBooking();
  };

  return (
    <>
      <SeoHead title="Automatización con IA para Ventas | Bots y Flujos | ROICAS" description={description} canonical={canonical}
        schemaJson={serviceSchema} />
      <Header />
      <main id="contenido-principal" className="roicas-web-design roicas-service-page">
        <section className="rwd-hero rsp-hero rsp-service-hero rsp-image-hero rsp-crm-hero" aria-labelledby="service-title">
          <ParticlesBackground particleCount={24} speed={0.22} />
          <div className="section-container rwd-hero-layout rsp-hero-content">
            <div>
              <h1 id="service-title">Automatización de <span>WhatsApp y CRM.</span></h1>
              <p className="rwd-hero-description">Conectamos WhatsApp, formularios y CRM para organizar las consultas. Configuramos agentes con IA cuando aportan a las reglas de tu equipo.</p>
              <picture className="rsp-mobile-hero-image">
                <source media="(max-width: 767px)" srcSet="/images/services/hero-crm-mobile.webp" />
                <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Panel de CRM en computador y móvil con contactos y oportunidades." width={1080} height={1080} loading="lazy" decoding="async" />
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
              <h2 id="service-scope">Qué ocurre después de una consulta</h2>
              <p>Diseñamos cada flujo con tu equipo. Acordamos qué puede resolver un agente, cuándo interviene una persona y qué debe quedar en el CRM.</p>
            </div>
            <Tabs.Root defaultValue={capabilities[0].id} className="rwd-connections">
              <Tabs.List className="rwd-connection-tabs rsp-tabs" aria-label="Qué ocurre después de una consulta">
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
                <li><Link className="rwd-link" to="/servicios/diseno-web">Conectar los formularios de mi web <ArrowRight size={16} aria-hidden="true" /></Link></li>
                <li><Link className="rwd-link" to="/servicios/publicidad-digital">Captar consultas con campañas <ArrowRight size={16} aria-hidden="true" /></Link></li>
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
              <h2 id="service-contact">Revisemos cómo atiende tu equipo</h2>
              <p>Cuéntanos cómo llegan las consultas y qué tareas quieres organizar o automatizar.</p>
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
