import { 
  Compass, 
  MonitorCheck,
  KeyRound,
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  FileText,
  Calendar
} from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import "./process-timeline.css";

const processSteps = [
  {
    step: "01",
    tag: "01 · Estrategia",
    title: "Entender tu negocio y definir el alcance",
    description: "Revisamos tus canales actuales, tus flujos de consulta y el objetivo comercial exacto. Todo queda documentado para no improvisar en el camino.",
    image: "/images/pillars/process-step-1-estrategia.webp",
    imageAlt: "Reunión de estrategia digital, definición de alcance y arquitectura del proyecto",
    featured: { icon: FileText, title: "Propuesta de alcance", detail: "Entregables, plazos y precio" },
    deliverables: [
      "Diagnóstico de tu presencia digital actual",
      "Definición de arquitectura y flujos de contacto"
    ],
    timeframe: "Antes de empezar"
  },
  {
    step: "02",
    tag: "02 · Construcción",
    title: "Diseñar, construir e integrar tus canales",
    description: "Diseñamos, construimos y probamos las piezas acordadas. Según el proyecto, incluimos tu sitio web, SEO técnico o conexiones con WhatsApp y GoHighLevel.",
    image: "/images/pillars/process-step-2-construccion.webp",
    imageAlt: "Desarrollo técnico de páginas web e integración de CRM GoHighLevel y WhatsApp",
    featured: { icon: MonitorCheck, title: "Vista previa para revisar", detail: "Pruebas en servidor privado" },
    deliverables: [
      "Diseño adaptado a móvil (mobile-first)",
      "Conexión con WhatsApp y GoHighLevel según alcance"
    ],
    timeframe: "Desarrollo iterativo"
  },
  {
    step: "03",
    tag: "03 · Lanzamiento",
    title: "Publicar, medir y acompañar tus resultados",
    description: "Publicamos el proyecto y revisamos su funcionamiento. La propuesta detalla qué seguimiento, monitoreo y soporte incluye.",
    image: "/images/pillars/process-step-3-lanzamiento.webp",
    imageAlt: "Lanzamiento en producción, indexación en Google y acompañamiento comercial continuo",
    featured: { icon: KeyRound, title: "Entrega del proyecto", detail: "Accesos y condiciones de soporte" },
    deliverables: [
      "Lanzamiento oficial en producción",
      "Preparación para indexación en Google, si aplica"
    ],
    timeframe: "En línea y medible"
  }
];

export default function ProcessSection() {
  const { openBooking } = useBooking();

  return (
    <section id="como-funciona" className="roicas-process-timeline" aria-labelledby="process-title">
      <div className="rpt-inner">
        
        {/* Encabezado Editorial */}
        <div className="rpt-header">
          <div>
            <span className="rpt-eyebrow">
              <Compass size={16} aria-hidden="true" />
              Metodología de Trabajo · Sin Sorpresas
            </span>
            <h2 id="process-title">
              Un proyecto claro.<br />
              <span>De principio a seguimiento.</span>
            </h2>
          </div>
          <div>
            <p className="rpt-intro">
              Antes de escribir una sola línea de código o activar una campaña, acordamos qué vamos a resolver,
              qué incluye el proyecto y cuál será el cronograma de entrega.
            </p>
            <div className="rpt-guarantees-row">
              <span className="rpt-guarantee-pill">
                <FileText size={13} aria-hidden="true" />
                Alcance y entregables definidos
              </span>
              <span className="rpt-guarantee-pill">
                <Clock size={13} aria-hidden="true" />
                Fechas acordadas desde el inicio
              </span>
              <span className="rpt-guarantee-pill">
                <ShieldCheck size={13} aria-hidden="true" />
                Soporte según la propuesta
              </span>
            </div>
          </div>
        </div>

        {/* Pasos Conectados */}
        <div className="rpt-steps-grid" role="list">
          {processSteps.map(({ featured: { icon: DeliverableIcon, title, detail }, ...stepItem }) => (
            <article 
              key={stepItem.step} 
              className="rpt-step-card" 
              role="listitem"
              aria-label={`Paso ${stepItem.step}: ${stepItem.title}`}
            >
              {/* Imagen de apoyo del paso */}
              <div className="rpt-step-visual">
                <img
                  src={stepItem.image}
                  alt={stepItem.imageAlt}
                  loading="lazy"
                  width={800}
                  height={450}
                  className="rpt-step-img"
                />
                <div className="rpt-step-visual-overlay" aria-hidden="true" />
                <span className="rpt-step-tag">
                  {stepItem.tag}
                </span>
              </div>

              <div className="rpt-step-body">
                <div className="rpt-step-top">
                  <div className="rpt-step-number" aria-hidden="true">
                    {stepItem.step}
                  </div>
                  <span className="rpt-step-timeframe">{stepItem.timeframe}</span>
                </div>

                <h3>{stepItem.title}</h3>
                <p className="rpt-step-desc">{stepItem.description}</p>

                <ul className="rpt-deliverables-list" aria-label="Entregables del paso">
                  <li className="rpt-featured-deliverable">
                    <span className="rpt-featured-icon" aria-hidden="true"><DeliverableIcon size={23} /></span>
                    <div>
                      <strong>{title}</strong>
                      <span>{detail}</span>
                    </div>
                  </li>
                  {stepItem.deliverables.map((deliverable) => (
                    <li key={deliverable} className="rpt-deliverable-item">
                      <CheckCircle2 size={16} className="rpt-deliverable-icon" aria-hidden="true" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Banner Inferior de Cierre */}
        <div className="rpt-bottom-cta">
          <div className="rpt-bottom-info">
            <h4>¿Quieres estructurar tu proyecto con un alcance claro?</h4>
            <p>Revisamos tus necesidades y te entregamos una propuesta personalizada sin costo.</p>
          </div>
          <div className="rpt-bottom-actions">
            <button 
              type="button" 
              onClick={() => {
                  trackCtaClicked("Agendar consultoría", "proceso");
                openBooking();
              }}
              className="rpt-btn-primary"
            >
              <Calendar size={18} aria-hidden="true" />
              <span>Agendar consultoría</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <a href="#contacto" className="rpt-link-secondary">
              Solicitar que me contacten
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
