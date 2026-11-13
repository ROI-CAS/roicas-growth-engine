import { ArrowDown, ArrowRight, ExternalLink, FileText, Gauge, ScanSearch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ContactSection from "@/components/ContactSection";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import "./services/diseno-web.css";
import "./services/service-pages.css";

const doctorUrl = "https://doctor.roicas.com";
const reportDetails = [
  { title: "Rendimiento por dispositivo", text: "Mediciones separadas en móvil y computador para entender cómo responde tu sitio en cada perfil.", icon: Gauge },
  { title: "Hallazgos con evidencia", text: "Señales observadas desde el exterior y comprobaciones sugeridas para decidir qué conviene revisar primero.", icon: ScanSearch },
  { title: "Informe privado", text: "Resultados en HTML y PDF. Consulta en WP Doctor cómo se entrega el informe y las condiciones del enlace privado.", icon: FileText },
];

export default function WPDoctor() {
  return (
    <>
      <SeoHead
        title="WP Doctor | Diagnóstico y mantenimiento WordPress · Roicas"
        description="Conoce WP Doctor: revisión de rendimiento y señales de problemas de tu WordPress, con evidencia y un informe privado."
        canonical="/wp-doctor"
      />
      <Header />
      <main id="contenido-principal" className="roicas-web-design roicas-service-page">
        <section className="rwd-hero rsp-hero" aria-labelledby="doctor-title">
          <ParticlesBackground particleCount={24} speed={0.22} />
          <div className="section-container rwd-hero-layout rsp-hero-content">
            <div>
              <h1 id="doctor-title">WP Doctor <span>para tu sitio WordPress.</span></h1>
              <p className="rwd-hero-description">Revisa cómo carga tu web y qué señales de problemas aparecen. El informe te ayuda a decidir por dónde empezar.</p>
              <div className="rwd-actions">
                <a href={doctorUrl} className="rwd-button rwd-button-light">Visitar WP Doctor <ExternalLink size={18} aria-hidden="true" /></a>
                <a href="#informe" className="rwd-link">Ver alcance del informe <ArrowDown size={17} aria-hidden="true" /></a>
              </div>
              <p className="rwd-note">La disponibilidad y las condiciones se consultan en WP Doctor.</p>
            </div>
            <img className="rwd-hero-image rsp-hero-image" src="/images/pillars/process-step-2-construccion.webp"
              alt="Portátil y monitores mostrando código" width={800} height={450} fetchPriority="high" decoding="async" />
          </div>
        </section>

        <section id="informe" className="rwd-section rwd-technology" aria-labelledby="doctor-report-title">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="doctor-report-title">Qué incluye el informe</h2>
              <p>La revisión externa te ayuda a identificar qué puedes comprobar a continuación con tu equipo técnico.</p>
            </div>
            <div className="rwd-scope-grid">
              {reportDetails.map(({ title, text, icon: Icon }) => (
                <article className="rwd-scope-item bg-white" key={title}>
                  <Icon size={28} className="mb-4 text-brand" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rwd-section rwd-close" aria-labelledby="doctor-support-title">
          <div className="section-container rwd-close-layout">
            <div>
              <h2 id="doctor-support-title">Revisa tus próximos pasos</h2>
              <p>Si necesitas acompañamiento, podemos ayudarte a definir qué revisar o qué mantenimiento conviene para tu sitio.</p>
            </div>
            <div className="rwd-actions">
              <a href={doctorUrl} className="rwd-button rwd-button-light">Visitar WP Doctor <ExternalLink size={18} aria-hidden="true" /></a>
              <a href="/contacto" className="rwd-link">Consultar con Roicas <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
