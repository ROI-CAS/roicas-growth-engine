import { ArrowUpRight, Globe2, Megaphone, Workflow } from "lucide-react";
import { BlurFade } from "./ui/blur-fade";
import "./featured-project.css";

export default function FeaturedProject() {
  return (
    <section id="proyectos" className="roicas-featured-project" aria-labelledby="project-title">
      <div className="section-container">
        <BlurFade inView duration={0.4} blur="3px" className="rfp-layout">
          <div className="rfp-copy">
            <p className="rfp-eyebrow">Proyecto destacado · FinDolor</p>
            <h2 id="project-title">De encontrar FinDolor a pedir una cita.</h2>
            <p className="rfp-description">
              El sitio principal presenta los servicios del centro. En la página de citas, la persona puede solicitar una valoración, pedir que la llamen o continuar por WhatsApp.
            </p>
            <ul className="rfp-details" aria-label="Trabajo de Roicas para FinDolor">
              <li>
                <Globe2 size={19} aria-hidden="true" />
                <div><strong>Web y contenido</strong><p>Sitio web principal y creación de publicaciones semanales.</p></div>
              </li>
              <li>
                <Megaphone size={19} aria-hidden="true" />
                <div><strong>Campañas y citas</strong><p>Landing de citas y gestión de campañas en Google Ads y Meta Ads.</p></div>
              </li>
              <li>
                <Workflow size={19} aria-hidden="true" />
                <div><strong>Seguimiento</strong><p>Automatización de consultas con el CRM GoHighLevel (GHL).</p></div>
              </li>
            </ul>
            <div className="rfp-links">
              <a className="rfp-link" href="https://citas.findolor.com/" target="_blank" rel="noopener noreferrer">
                Ver página de citas <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="rfp-link" href="https://www.findolor.com/" target="_blank" rel="noopener noreferrer">
                Ver sitio web de FinDolor <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="rfp-visual">
            <img src="/products/web-express/images/projects/findolor.webp" alt="Vista del diseño de FinDolor en un portátil y un teléfono, con el formulario de valoración y accesos de contacto" width={1200} height={900} loading="lazy" decoding="async" />
            <figcaption>Página de citas de FinDolor · Diseño para móvil y escritorio</figcaption>
          </figure>
        </BlurFade>
      </div>
    </section>
  );
}
