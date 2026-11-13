import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Briefcase,
  Layers,
  Sparkles,
  Cloud,
  Users,
  Building2,
  Lock,
  Compass
} from "lucide-react";
import { AccessibleDialog } from "./AccessibleDialog";
import { trackEvidenceLightboxOpened, trackCtaClicked } from "@/lib/analytics";
import { useBooking } from "@/contexts/BookingContext";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import seoCase01 from "@/assets/results/seo-case-01.png";
import seoCase02 from "@/assets/results/seo-case-02.png";
import seoCase03 from "@/assets/results/seo-case-03.png";

import falconLogo from "@/assets/clients/falcon-cloud.png";
import componenteLogo from "@/assets/clients/componente-legal.png";
import findolorLogo from "@/assets/clients/findolor.png";
import ecosferaLogo from "@/assets/clients/ecosfera.png";
import torregrozaLogo from "@/assets/clients/torregroza-diazgranados.png";
import aeroLogo from "@/assets/clients/aero-ambulancias.jpg";

import "./success-bento.css";

// Evidencias auditadas de Google Search Console para el lightbox
const evidenceItems = [
  { 
    src: seoCase01, 
    client: "FinDolor · Centro Médico",
    title: "Tráfico e impresiones orgánicas en Google", 
    alt: "Panel de Search Console con 85.64K impresiones y 18.2K clics en tratamientos médicos",
    metricHighlight: "85.64K impresiones · 18.2K clics",
    note: "Métricas auditadas del canal orgánico en Colombia. Refleja pacientes reales buscando alivio del dolor sin dependencia de pauta."
  },
  { 
    src: seoCase02, 
    client: "Componente Legal · Asesoría Jurídica",
    title: "Palabras clave corporativas en los primeros resultados", 
    alt: "Gráfico de posiciones SEO con 236 términos en primeros puestos de Google",
    metricHighlight: "236 términos en top 3 de Google",
    note: "Posicionamiento orgánico de alta intención para captación de clientes corporativos y contratos mercantiles."
  },
  { 
    src: seoCase03, 
    client: "Metodología Técnica Roicas · Auditoría Orgánica",
    title: "Evolución y estabilidad del posicionamiento sostenido", 
    alt: "Gráfico de evolución continua de tráfico orgánico e indexación",
    metricHighlight: "Curva ascendente sostenida mes a mes",
    note: "Crecimiento estructural verificado: arquitectura semántica limpia y velocidad de carga que genera autoridad de dominio."
  },
];

export default function SuccessStoriesSection() {
  const { openBooking } = useBooking();
  const [selectedEvidence, setSelectedEvidence] = useState<number | null>(null);

  const activeModalData = selectedEvidence !== null ? evidenceItems[selectedEvidence] : null;

  const openModal = (index: number) => {
    setSelectedEvidence(index);
    trackEvidenceLightboxOpened(index);
  };

  return (
    <section id="resultados" className="roicas-success-bento" aria-labelledby="success-stories-title">
      <div className="rsb-inner">
        
        {/* Cabecera Cinematográfica */}
        <div className="rsb-header">
          <div>
            <span className="rsb-eyebrow">
              <ShieldCheck size={16} aria-hidden="true" />
              Evidencia Real & Clientes Corporativos
            </span>
            <h2 id="success-stories-title">
              Diseño de alto impacto,<br />
              <span>respaldado con datos reales.</span>
            </h2>
          </div>
          <div>
            <p className="rsb-intro">
              No mostramos maquetas vacías ni resultados simulados. Creamos plataformas
              para empresas consolidadas y las respaldamos con métricas auditables de Google y crecimiento operativo.
            </p>
            <div className="rsb-disclaimer-pill" role="note">
              <Activity size={14} aria-hidden="true" />
              Datos auditados de Google Search Console · Proyectos corporativos en producción
            </div>
          </div>
        </div>

        {/* Bento Grid Principal */}
        <div className="rsb-grid">
          
          {/* Card 1: Falcon Cloud (SaaS Corporativo & Biometría) - Span 7 */}
          <SpotlightCard 
            className="rsb-card rsb-card-featured" 
            contentClassName="flex flex-col justify-between h-full"
            spotlightColor="rgba(255, 92, 103, 0.15)"
            borderColor="rgba(255, 92, 103, 0.35)"
            aria-label="Caso de éxito Falcon Cloud"
          >
            <div className="rsb-card-body">
              <div className="rsb-card-badge-row">
                <span className="rsb-badge rsb-badge-enterprise">
                  <Cloud size={13} aria-hidden="true" />
                  SaaS Corporativo & Cloud
                </span>
                <div className="rsb-client-tag">
                  <img src={falconLogo} alt="Falcon Cloud" className="rsb-client-thumb-logo" />
                  <span>Falcon Cloud</span>
                </div>
              </div>
              
              <h3>Portal web corporativo y plataforma de gestión para más de 50.000 usuarios</h3>
              <p className="rsb-card-desc">
                Desarrollo web de alta escala y arquitectura de captación para la solución líder en control 
                de asistencia biométrica y gestión de turnos para grandes compañías en Colombia y la región.
              </p>
              
              <div className="rsb-metrics-row">
                <div className="rsb-metric-chip rsb-metric-accent">
                  <Users size={15} aria-hidden="true" />
                  <span><strong>+<NumberTicker value={50000} /></strong> colaboradores gestionados</span>
                </div>
                <div className="rsb-metric-chip">
                  <Lock size={15} aria-hidden="true" />
                  <span>Seguridad & Tiempo Real</span>
                </div>
                <div className="rsb-metric-chip">
                  <CheckCircle2 size={15} className="text-emerald-500" aria-hidden="true" />
                  <span>Pipeline B2B Calificado</span>
                </div>
              </div>
            </div>

            {/* Mockup de Interfaz Corporativa Falcon Cloud */}
            <div className="rsb-saas-mockup-wrap">
              <div className="rsb-browser-mockup">
                <div className="rsb-browser-bar">
                  <div className="rsb-browser-dots">
                    <span className="rsb-browser-dot" />
                    <span className="rsb-browser-dot" />
                    <span className="rsb-browser-dot" />
                  </div>
                  <span className="rsb-browser-url">portal.falconcloud.co/enterprise</span>
                </div>
                <div className="rsb-enterprise-ui-preview">
                  <div className="rsb-ui-topbar">
                    <div className="rsb-ui-logo-space">
                      <img src={falconLogo} alt="" height={20} />
                      <span className="rsb-ui-badge-live">Cloud Active</span>
                    </div>
                    <div className="rsb-ui-top-stats">
                      <span>Nodos Activos: <strong>99.98%</strong></span>
                      <span>Marcaciones Hoy: <strong><NumberTicker value={142850} /></strong></span>
                    </div>
                  </div>
                  <div className="rsb-ui-grid-demo">
                    <div className="rsb-ui-widget">
                      <small>Gestión de Asistencia en Tiempo Real</small>
                      <div className="rsb-ui-bars">
                        <div className="rsb-ui-bar" style={{ height: "45%" }} />
                        <div className="rsb-ui-bar" style={{ height: "68%" }} />
                        <div className="rsb-ui-bar" style={{ height: "82%" }} />
                        <div className="rsb-ui-bar" style={{ height: "60%" }} />
                        <div className="rsb-ui-bar rsb-ui-bar-active" style={{ height: "94%" }} />
                      </div>
                      <span className="rsb-ui-metric">+34% Eficiencia de control</span>
                    </div>
                    <div className="rsb-ui-widget">
                      <small>Sincronización Biométrica Facial & Huella</small>
                      <div className="rsb-ui-indicator-row">
                        <span className="rsb-pulse-dot" />
                        <strong>1.240 terminales conectadas</strong>
                      </div>
                      <span className="rsb-ui-metric">Latencia: &lt;120ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Componente Legal (Servicios Jurídicos B2B) - Span 5 */}
          <SpotlightCard 
            className="rsb-card rsb-card-legal" 
            contentClassName="flex flex-col justify-between h-full"
            spotlightColor="rgba(255, 92, 103, 0.15)"
            borderColor="rgba(255, 92, 103, 0.35)"
            aria-label="Caso de éxito Componente Legal"
          >
            <div className="rsb-card-body">
              <div className="rsb-card-badge-row">
                <span className="rsb-badge">
                  <Briefcase size={13} aria-hidden="true" />
                  Servicios Jurídicos B2B
                </span>
                <div className="rsb-client-tag">
                  <img src={componenteLogo} alt="Componente Legal" className="rsb-client-thumb-logo" />
                  <span>Componente Legal</span>
                </div>
              </div>
              
              <h3>Autoridad corporativa y captación de clientes de alto valor</h3>
              <p className="rsb-card-desc">
                Desarrollo web sobrio y estructurado para transmitir solidez legal inmediata, conectado
                con una estrategia de posicionamiento orgánico en términos mercantiles de alta intención.
              </p>

              <div className="rsb-metrics-row">
                <div className="rsb-metric-chip rsb-metric-accent">
                  <TrendingUp size={15} aria-hidden="true" />
                  <span><strong><NumberTicker value={236} /></strong> términos en Top 3</span>
                </div>
                <div className="rsb-metric-chip">
                  <span>Prospectos corporativos calificados</span>
                </div>
              </div>
            </div>

            {/* Preview interactivo de la evidencia Search Console */}
            <div className="rsb-card-media-legal">
              <button 
                type="button" 
                onClick={() => openModal(1)}
                className="rsb-chart-preview-btn rsb-chart-preview-wide"
                aria-label="Ampliar datos SEO de Componente Legal en Google Search Console"
              >
                <div className="rsb-chart-thumb-wrap">
                  <img src={seoCase02} alt="Posicionamiento de Componente Legal en Google" loading="lazy" />
                  <div className="rsb-chart-zoom-overlay">
                    <ZoomIn size={18} aria-hidden="true" />
                    <span>Ver informe auditado</span>
                  </div>
                </div>
                <div className="rsb-chart-footer">
                  <div className="rsb-chart-footer-info">
                    <span className="rsb-chart-client">Componente Legal</span>
                    <span className="rsb-chart-meta">Top 3 en Google Search Console</span>
                  </div>
                  <ExternalLink size={15} aria-hidden="true" />
                </div>
              </button>
            </div>
          </SpotlightCard>

          {/* Card 3: FinDolor (Salud & Alta Especialidad) - Span 6 */}
          <SpotlightCard 
            className="rsb-card rsb-card-medical" 
            contentClassName="flex flex-col justify-between h-full"
            spotlightColor="rgba(255, 92, 103, 0.15)"
            borderColor="rgba(255, 92, 103, 0.35)"
            aria-label="Caso de éxito FinDolor"
          >
            <div className="rsb-card-body">
              <div className="rsb-card-badge-row">
                <span className="rsb-badge rsb-badge-medical">
                  <Stethoscope size={13} aria-hidden="true" />
                  Salud & Especialidades
                </span>
                <div className="rsb-client-tag">
                  <img src={findolorLogo} alt="FinDolor" className="rsb-client-thumb-logo" />
                  <span>FinDolor</span>
                </div>
              </div>

              <h3>Web médica de alta conversión con 85K+ impresiones orgánicas</h3>
              <p className="rsb-card-desc">
                Desarrollo centrado en la tranquilidad del paciente, rapidez en móvil y canal directo de agendamiento 
                médico vía WhatsApp, sustentado en visibilidad orgánica sin costo por clic.
              </p>

              <div className="rsb-metrics-row">
                <div className="rsb-metric-chip rsb-metric-accent">
                  <TrendingUp size={15} aria-hidden="true" />
                  <span><strong>+<NumberTicker value={85.6} decimalPlaces={1} />K</strong> impresiones</span>
                </div>
                <div className="rsb-metric-chip">
                  <span><strong><NumberTicker value={18.2} decimalPlaces={1} />K+</strong> clics orgánicos</span>
                </div>
                <div className="rsb-metric-chip">
                  <CheckCircle2 size={15} className="text-emerald-500" aria-hidden="true" />
                  <span>Citas WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="rsb-card-media-chart">
              <button 
                type="button" 
                onClick={() => openModal(0)}
                className="rsb-chart-preview-btn"
                aria-label="Ampliar datos SEO de FinDolor en Google Search Console"
              >
                <div className="rsb-chart-thumb-wrap">
                  <img src={seoCase01} alt="Search Console FinDolor con 85K impresiones" loading="lazy" />
                  <div className="rsb-chart-zoom-overlay">
                    <ZoomIn size={18} aria-hidden="true" />
                    <span>Ver informe auditado</span>
                  </div>
                </div>
                <div className="rsb-chart-footer">
                  <div className="rsb-chart-footer-info">
                    <span className="rsb-chart-client">FinDolor · Centro Médico</span>
                    <span className="rsb-chart-meta">Tráfico e impresiones orgánicas</span>
                  </div>
                  <ExternalLink size={15} aria-hidden="true" />
                </div>
              </button>
            </div>
          </SpotlightCard>

          {/* Card 4: Ecosfera & Portafolio Industrial B2B - Span 6 */}
          <SpotlightCard 
            className="rsb-card rsb-card-enterprise-b2b" 
            contentClassName="flex flex-col justify-between h-full"
            spotlightColor="rgba(255, 92, 103, 0.15)"
            borderColor="rgba(255, 92, 103, 0.35)"
            aria-label="Ecosfera y clientes industriales"
          >
            <div className="rsb-card-body">
              <div className="rsb-card-badge-row">
                <span className="rsb-badge rsb-badge-brand">
                  <Activity size={13} aria-hidden="true" />
                  Rigor Técnico & Estabilidad
                </span>
                <span className="rsb-client-name">Ecosfera · Aero Ambulancias · Torregroza</span>
              </div>

              <h3>Crecimiento orgánico estructural sin depender solo de pauta diaria</h3>
              <p className="rsb-card-desc">
                Optimización técnica profunda: Core Web Vitals, estructuración semántica de esquemas y arquitectura 
                de contenidos que protegen la posición de la marca frente a fluctuaciones de algoritmos.
              </p>

              {/* Tira de clientes de respaldo */}
              <div className="rsb-clients-micro-row">
                <div className="rsb-client-micro-pill">
                  <img src={ecosferaLogo} alt="Ecosfera" />
                  <span>Ecosfera Ambiental</span>
                </div>
                <div className="rsb-client-micro-pill">
                  <img src={torregrozaLogo} alt="Torregroza" />
                  <span>Torregroza & D.</span>
                </div>
                <div className="rsb-client-micro-pill">
                  <img src={aeroLogo} alt="Aero Ambulancias" />
                  <span>Aero Ambulancias</span>
                </div>
              </div>

              <div className="rsb-metrics-row">
                <div className="rsb-metric-chip rsb-metric-accent">
                  <TrendingUp size={15} aria-hidden="true" />
                  <span>Curva ascendente auditada</span>
                </div>
                <div className="rsb-metric-chip">
                  <span>0% costo por clic en tráfico orgánico</span>
                </div>
              </div>
            </div>

            <div className="rsb-card-media-chart">
              <button 
                type="button" 
                onClick={() => openModal(2)}
                className="rsb-chart-preview-btn"
                aria-label="Ampliar datos de evolución SEO en Google Search Console"
              >
                <div className="rsb-chart-thumb-wrap">
                  <img src={seoCase03} alt="Evolución SEO sostenida en Google Search Console" loading="lazy" />
                  <div className="rsb-chart-zoom-overlay">
                    <ZoomIn size={18} aria-hidden="true" />
                    <span>Ver informe auditado</span>
                  </div>
                </div>
                <div className="rsb-chart-footer">
                  <div className="rsb-chart-footer-info">
                    <span className="rsb-chart-client">Auditoría Roicas</span>
                    <span className="rsb-chart-meta">Evolución continua de tráfico orgánico</span>
                  </div>
                  <ExternalLink size={15} aria-hidden="true" />
                </div>
              </button>
            </div>
          </SpotlightCard>

        </div>

        {/* Footer de Conversión de la Sección */}
        <div className="rsb-cta-bar">
          <div className="rsb-cta-text">
            <h3>¿Quieres una estrategia con resultados verificables para tu empresa?</h3>
            <p>Analizamos tu sitio actual, tus competidores y las oportunidades reales de tu sector.</p>
          </div>
          <button 
            type="button"
            className="rsb-btn-primary"
            onClick={() => {
              trackCtaClicked("Agendar consultoría de resultados", "success_stories");
              openBooking();
            }}
          >
            <span>Agendar consultoría estratégica</span>
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>

      </div>

      {/* Lightbox Modal Accesible para Auditoría de Search Console */}
      <AccessibleDialog
        open={selectedEvidence !== null}
        onClose={() => setSelectedEvidence(null)}
        title={activeModalData?.title || "Evidencia verificada"}
        description={activeModalData?.note || "Métricas auditadas de Search Console"}
      >
        {activeModalData && (
          <div className="rsb-lightbox-content">
            <div className="rsb-lightbox-header">
              <span className="rsb-lightbox-client">{activeModalData.client}</span>
              <span className="rsb-lightbox-metric">{activeModalData.metricHighlight}</span>
            </div>
            
            <div className="rsb-lightbox-img-wrap">
              <img 
                src={activeModalData.src} 
                alt={activeModalData.alt} 
                className="rsb-lightbox-img"
              />
            </div>
            
            <p className="rsb-lightbox-note">
              {activeModalData.note}
            </p>

            <div className="rsb-lightbox-nav">
              <button 
                type="button" 
                className="rsb-modal-nav-btn"
                onClick={() => setSelectedEvidence((prev) => (prev! > 0 ? prev! - 1 : evidenceItems.length - 1))}
                aria-label="Ver evidencia anterior"
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Anterior</span>
              </button>
              <span className="rsb-modal-nav-counter">
                {(selectedEvidence ?? 0) + 1} de {evidenceItems.length}
              </span>
              <button 
                type="button" 
                className="rsb-modal-nav-btn"
                onClick={() => setSelectedEvidence((prev) => (prev! < evidenceItems.length - 1 ? prev! + 1 : 0))}
                aria-label="Ver evidencia siguiente"
              >
                <span>Siguiente</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </section>
  );
}
