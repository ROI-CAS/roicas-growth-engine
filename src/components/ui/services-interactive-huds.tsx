import { useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock,
  Globe2,
  MessageSquare,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";

/* HUD 1: Arquitectura Web de Alto Desempeño & Conversión */
export function WebArchitectureHud() {
  const [activeTab, setActiveTab] = useState<"design" | "conversion" | "seo">("design");

  return (
    <div className="rsi-hud rsi-hud-web" role="region" aria-label="Demostración de un sitio web">
      {/* Barra de Navegador Superior */}
      <div className="rsi-hud-browser-bar">
        <div className="rsi-hud-dots">
          <span className="rsi-hud-dot rsi-hud-dot-red" />
          <span className="rsi-hud-dot rsi-hud-dot-yellow" />
          <span className="rsi-hud-dot rsi-hud-dot-green" />
        </div>
        <div className="rsi-hud-address">
          <ShieldCheck size={12} className="text-emerald-400" aria-hidden="true" />
          <span>tuempresa.example/servicios</span>
        </div>
        <div className="rsi-hud-lighthouse-badge">
          <span className="rsi-hud-score-pill">Demostración</span>
        </div>
      </div>

      {/* Características del sitio */}
      <div className="rsi-hud-speed-ribbon">
        <div className="rsi-hud-metric-mini">
          <span className="rsi-hud-metric-label">Móvil:</span>
          <strong className="text-emerald-400">Diseño adaptable</strong>
        </div>
        <div className="rsi-hud-metric-mini">
          <span className="rsi-hud-metric-label">Diseño:</span>
          <strong className="text-emerald-400">A la medida</strong>
        </div>
        <div className="rsi-hud-metric-mini">
          <span className="rsi-hud-metric-label">Propiedad:</span>
          <strong className="text-emerald-400">De tu empresa</strong>
        </div>
      </div>

      {/* Pestañas Interactivas del HUD */}
      <div className="rsi-hud-tabs" role="tablist" aria-label="Aspectos del sitio web">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "design"}
          className={`rsi-hud-tab ${activeTab === "design" ? "active" : ""}`}
          onClick={() => setActiveTab("design")}
        >
          <Zap size={13} aria-hidden="true" />
          <span>Diseño & Claridad</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "conversion"}
          className={`rsi-hud-tab ${activeTab === "conversion" ? "active" : ""}`}
          onClick={() => setActiveTab("conversion")}
        >
          <Smartphone size={13} aria-hidden="true" />
          <span>Móvil & WhatsApp</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "seo"}
          className={`rsi-hud-tab ${activeTab === "seo" ? "active" : ""}`}
          onClick={() => setActiveTab("seo")}
        >
          <Globe2 size={13} aria-hidden="true" />
          <span>SEO técnico</span>
        </button>
      </div>

      {/* Canvas Dinámico según la Pestaña */}
      <div className="rsi-hud-canvas">
        {activeTab === "design" && (
          <div className="rsi-hud-view rsi-hud-view-speed">
            <div className="rsi-hud-card-mockup">
              <div className="rsi-hud-mock-header">
                <div className="rsi-hud-mock-logo" />
                <div className="rsi-hud-mock-nav">
                  <span />
                  <span />
                  <span className="rsi-hud-mock-cta">Cotizar</span>
                </div>
              </div>
              <div className="rsi-hud-mock-body">
                <span className="rsi-hud-mock-tag">Tu Propuesta de Valor</span>
                <h4>Una página que explica claramente lo que ofreces</h4>
                <p>Navegación intuitiva y llamadas a la acción visibles para que tus clientes encuentren rápidamente cómo contactarte.</p>
                <div className="rsi-hud-mock-stats">
                  <div className="rsi-hud-mock-stat-item">
                    <span className="rsi-hud-mock-stat-num">Fácil</span>
                    <span className="rsi-hud-mock-stat-txt">De editar por tu equipo</span>
                  </div>
                  <div className="rsi-hud-mock-stat-item">
                    <span className="rsi-hud-mock-stat-num">Móvil</span>
                    <span className="rsi-hud-mock-stat-txt">Contenido que se adapta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "conversion" && (
          <div className="rsi-hud-view rsi-hud-view-conversion">
            <div className="rsi-hud-mobile-mockup">
              <div className="rsi-hud-phone-island" />
              <div className="rsi-hud-phone-header">
                <span className="rsi-hud-phone-title">Tu Empresa</span>
                <span className="rsi-hud-badge-live">Vista móvil</span>
              </div>
              <div className="rsi-hud-phone-content">
                <p className="rsi-hud-phone-text">Qué vendes, por qué elegirte y el botón para hablar directamente por WhatsApp.</p>
                <div className="rsi-hud-phone-cta-button">
                  <MessageSquare size={14} aria-hidden="true" />
                  <span>Escribir por WhatsApp</span>
                </div>
                <div className="rsi-hud-phone-trust-strip">
                  <span>Contacto directo</span>
                  <span>Acceso desde el celular</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="rsi-hud-view rsi-hud-view-seo">
            <div className="rsi-hud-serp-card">
              <div className="rsi-hud-serp-top">
                <div className="rsi-hud-serp-url-row">
                  <span className="rsi-hud-serp-favicon">G</span>
                  <div className="rsi-hud-serp-url-info">
                    <span className="rsi-hud-serp-brand">Tu empresa</span>
                    <span className="rsi-hud-serp-breadcrumb">https://tuempresa.example/servicios</span>
                  </div>
                </div>
                <span className="rsi-hud-serp-rank-pill">
                  <CheckCircle2 size={12} className="text-emerald-400" aria-hidden="true" />
                  Vista previa
                </span>
              </div>
              <h4 className="rsi-hud-serp-title">Tu Empresa | Servicios Especializados en Colombia</h4>
              <p className="rsi-hud-serp-snippet">
                Un título y una descripción claros ayudan a entender qué ofrece tu negocio y dónde atiende.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer de Estado */}
      <div className="rsi-hud-footer">
        <div className="rsi-hud-pill-tag">
          <Sparkles size={12} className="text-brand-on-dark" aria-hidden="true" />
          <span>Diseño centrado en generar consultas</span>
        </div>
        <div className="rsi-hud-pill-tag">
          <span>WordPress administrable sin saber programar</span>
        </div>
      </div>
    </div>
  );
}

/* HUD 2: Demostración de una búsqueda orgánica */
export function SearchAcquisitionHud() {
  const [selectedQuery, setSelectedQuery] = useState(0);

  const exampleQueries = [
    {
      query: "mantenimiento industrial bogotá",
      label: "Servicio local",
      url: "tuempresa.example/bogota",
      title: "Mantenimiento industrial para empresas en Bogotá",
      snippet: "Conoce los servicios de mantenimiento para maquinaria industrial, las zonas de atención y cómo solicitar una visita técnica.",
      sitelinkA: "Servicios disponibles",
      sitelinkADesc: "Equipos y tipos de mantenimiento",
      sitelinkB: "Zonas de atención",
      sitelinkBDesc: "Cobertura para empresas en Bogotá",
      takeaway: "Una página local explica el servicio y el área de atención a quien busca un proveedor en su ciudad.",
    },
    {
      query: "plan de mantenimiento preventivo",
      label: "Consulta técnica",
      url: "tuempresa.example/mantenimiento-preventivo",
      title: "Planes de mantenimiento preventivo para maquinaria",
      snippet: "Revisa qué incluye una inspección programada y qué datos de tus equipos sirven para preparar un plan de mantenimiento.",
      sitelinkA: "Qué incluye el plan",
      sitelinkADesc: "Inspecciones y revisiones programadas",
      sitelinkB: "Tipos de equipos",
      sitelinkBDesc: "Consulta las opciones de servicio",
      takeaway: "Una página de servicio responde preguntas concretas antes de que la persona solicite una cotización.",
    },
    {
      query: "cotizar mantenimiento industrial",
      label: "Solicitar cotización",
      url: "tuempresa.example/cotizar",
      title: "Solicita una cotización de mantenimiento industrial",
      snippet: "Comparte el tipo de equipo, la ubicación y el servicio que necesitas para que el equipo comercial pueda revisar tu solicitud.",
      sitelinkA: "Solicitar cotización",
      sitelinkADesc: "Formulario de contacto",
      sitelinkB: "Hablar por WhatsApp",
      sitelinkBDesc: "Consulta con el equipo comercial",
      takeaway: "Cuando alguien ya quiere cotizar, la página muestra el siguiente paso y los datos que debe tener a mano.",
    },
  ];

  const current = exampleQueries[selectedQuery];

  return (
    <div className="rsi-hud rsi-hud-search" role="region" aria-label="Demostración de una búsqueda orgánica">
      {/* Barra de Búsqueda de Google Simulada */}
      <div className="rsi-hud-search-bar">
        <Search size={15} className="text-gray-400" aria-hidden="true" />
        <span className="rsi-hud-search-input">{current.query}</span>
        <span className="rsi-hud-search-badge">Demostración</span>
      </div>

      {/* Selector de búsquedas de ejemplo */}
      <div className="rsi-hud-query-pills" role="tablist" aria-label="Ejemplos de búsquedas">
        {exampleQueries.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={selectedQuery === idx}
            className={`rsi-hud-query-pill ${selectedQuery === idx ? "active" : ""}`}
            onClick={() => setSelectedQuery(idx)}
          >
            <span className="rsi-hud-query-pos">Ejemplo {idx + 1}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Vista previa de un resultado orgánico */}
      <div className="rsi-hud-serp-card">
        <div className="rsi-hud-serp-top">
          <div className="rsi-hud-serp-url-row">
            <span className="rsi-hud-serp-favicon">E</span>
            <div className="rsi-hud-serp-url-info">
              <span className="rsi-hud-serp-brand">Tu empresa</span>
              <span className="rsi-hud-serp-breadcrumb">https://{current.url}</span>
            </div>
          </div>
          <span className="rsi-hud-serp-rank-pill">
            <CheckCircle2 size={12} className="text-emerald-400" aria-hidden="true" />
            Resultado simulado
          </span>
        </div>

        <h4 className="rsi-hud-serp-title">{current.title}</h4>

        <p className="rsi-hud-serp-snippet">{current.snippet}</p>

        {/* Ejemplos de enlaces a páginas internas */}
        <div className="rsi-hud-serp-sitelinks">
          <div className="rsi-hud-sitelink-item">
            <span>{current.sitelinkA}</span>
            <small>{current.sitelinkADesc}</small>
          </div>
          <div className="rsi-hud-sitelink-item">
            <span>{current.sitelinkB}</span>
            <small>{current.sitelinkBDesc}</small>
          </div>
        </div>
      </div>

      {/* Explicación Práctica y Humana para el Cliente */}
      <div className="rsi-hud-traffic-stats">
        <div className="rsi-hud-stat-box">
          <span className="rsi-hud-stat-title">Cómo funciona para tu negocio:</span>
          <strong>Contenido según la búsqueda</strong>
          <small>{current.takeaway}</small>
        </div>
        <div className="rsi-hud-stat-box">
          <span className="rsi-hud-stat-title">Recorrido de ejemplo</span>
          <strong className="text-emerald-400">Búsqueda → página → contacto</strong>
          <small>La página ofrece un formulario o WhatsApp para que el visitante pueda consultar.</small>
        </div>
      </div>
    </div>
  );
}

/* HUD 3: Automatización de Pipeline, WhatsApp & CRM */
export function CrmAutomationHud() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: "01",
      icon: MessageSquare,
      title: "Entrada de la consulta",
      desc: "Una persona escribe por WhatsApp o deja sus datos en el formulario.",
      badge: "WhatsApp / Web",
      telemetry: "Consulta registrada"
    },
    {
      num: "02",
      icon: Workflow,
      title: "Clasificación de la consulta",
      desc: "El flujo recoge la necesidad del cliente y la clasifica según tus reglas.",
      badge: "Reglas de negocio",
      telemetry: "Servicio identificado"
    },
    {
      num: "03",
      icon: BellRing,
      title: "Asignación a un asesor",
      desc: "El asesor asignado recibe una notificación con los datos de la consulta.",
      badge: "Notificación",
      telemetry: "Consulta asignada"
    },
    {
      num: "04",
      icon: TrendingUp,
      title: "Seguimiento en el CRM",
      desc: "El contacto y la oportunidad quedan registrados en GoHighLevel con una tarea de seguimiento.",
      badge: "GoHighLevel",
      telemetry: "Tarea programada"
    }
  ];

  return (
    <div className="rsi-hud rsi-hud-crm" role="region" aria-label="Demostración de automatización comercial">
      <div className="rsi-hud-crm-header">
        <div>
          <span className="rsi-hud-crm-tag">
            <Workflow size={13} aria-hidden="true" />
            Flujo comercial · GoHighLevel (GHL)
          </span>
          <h4>Del primer contacto al seguimiento</h4>
        </div>
        <div className="rsi-hud-sla-pill">
          <Clock size={13} className="text-emerald-400" aria-hidden="true" />
          <span>Demostración</span>
        </div>
      </div>

      {/* Pasos Interactivos del Pipeline */}
      <div className="rsi-hud-pipeline-list">
        {steps.map((st, index) => {
          const Icon = st.icon;
          const isSelected = activeStep === index;
          return (
            <div
              key={st.num}
              className={`rsi-hud-pipeline-item ${isSelected ? "active" : ""}`}
              onClick={() => setActiveStep(index)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveStep(index);
                }
              }}
            >
              <div className="rsi-hud-pipeline-left">
                <span className="rsi-hud-step-num">{st.num}</span>
                <div className="rsi-hud-step-icon">
                  <Icon size={16} aria-hidden="true" />
                </div>
                <div className="rsi-hud-step-info">
                  <strong>{st.title}</strong>
                  <p>{st.desc}</p>
                </div>
              </div>
              <div className="rsi-hud-pipeline-right">
                <span className="rsi-hud-pipeline-badge">{st.badge}</span>
                <span className="rsi-hud-pipeline-telemetry">{st.telemetry}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funciones del flujo */}
      <div className="rsi-hud-crm-footer">
        <div className="rsi-hud-crm-stat">
          <strong className="text-emerald-400">Registro</strong>
          <span>Consultas en el CRM</span>
        </div>
        <div className="rsi-hud-crm-stat">
          <strong className="text-emerald-400">Asignación</strong>
          <span>Alertas para el equipo</span>
        </div>
        <div className="rsi-hud-crm-stat">
          <strong className="text-emerald-400">Seguimiento</strong>
          <span>Tareas por oportunidad</span>
        </div>
      </div>
    </div>
  );
}

