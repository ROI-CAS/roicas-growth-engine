import { ArrowDown, ArrowRight, Bot, Globe2, Megaphone, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import SeoHead from "@/components/SeoHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import "./institutional.css";

const serviceGroups = [
  {
    title: "Construir tu presencia digital",
    description: "Dale a tus clientes un lugar claro para conocer tus servicios, pedir información o comprar.",
    items: [
      { title: "Diseño web", description: "Sitios en WordPress con contenido, navegación y formularios adaptados a tu negocio.", href: "/servicios/diseno-web", icon: Globe2 },
      { title: "Tiendas online", description: "Organiza tu catálogo, pagos y envíos en una tienda que tu equipo pueda administrar.", href: "/servicios/tiendas-online", icon: ShoppingCart },
    ],
  },
  {
    title: "Atraer clientes",
    description: "Trabaja tu visibilidad para llegar a personas interesadas en lo que ofreces.",
    items: [
      { title: "SEO", description: "Mejora la estructura y el contenido de tu sitio para facilitar que lo encuentren en Google.", href: "/servicios/seo", icon: Search },
      { title: "Publicidad digital", description: "Gestiona campañas en Google Ads y Meta Ads, con seguimiento de los resultados por canal.", href: "/servicios/publicidad-digital", icon: Megaphone },
    ],
  },
  {
    title: "Dar seguimiento a cada consulta",
    description: "Conecta los canales por los que llegan tus contactos con el trabajo de tu equipo comercial.",
    items: [
      { title: "Automatización con IA", description: "Integra WhatsApp, formularios y CRM para responder, organizar y dar seguimiento a las consultas.", href: "/servicios/automatizacion-ia", icon: Bot },
    ],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Servicios digitales para empresas | ROICAS Colombia" description="Diseño web, tiendas online, SEO, publicidad digital y automatización con IA. Explora los servicios de Roicas y elige por dónde empezar." canonical="https://roicas.com/servicios" />
      <Header />
      <main id="contenido-principal" className="roicas-institutional">
        <section className="ri-hero" aria-labelledby="services-title">
          <ParticlesBackground particleCount={30} speed={0.25} className="opacity-60" />
          <div className="section-container ri-hero-layout">
            <div className="ri-enter">
              <h1 id="services-title">Servicios digitales <span>para tu empresa</span></h1>
              <p className="ri-hero-lead">Construye tu presencia, atrae clientes o mejora el seguimiento comercial. Podemos trabajar en una de estas necesidades o conectar los servicios en una sola estrategia.</p>
              <div className="ri-actions">
                <a href="#servicios" className="ri-button ri-button-light">Explorar servicios <ArrowDown size={18} aria-hidden="true" /></a>
                <a href="#contacto" className="ri-link">Consultar mi proyecto <ArrowRight size={18} aria-hidden="true" /></a>
              </div>
            </div>
            <img className="ri-hero-image ri-enter" src="/images/pillars/strategy-web-presencia.webp" width={800} height={450} alt="Monitores con páginas web en proceso de diseño" fetchPriority="high" decoding="async" />
          </div>
        </section>

        <section id="servicios" className="ri-section ri-paper" aria-labelledby="service-options-title">
          <span id="estrategia" className="ri-anchor" aria-hidden="true" />
          <div className="section-container">
            <h2 id="service-options-title" className="ri-section-heading">¿Qué necesita tu negocio?</h2>
            <div className="ri-service-groups">
              {serviceGroups.map(({ title, description, items }) => (
                <article key={title} className="ri-service-group">
                  <div className="ri-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ul className="ri-service-list">
                    {items.map(({ title: name, description: summary, href, icon: Icon }) => (
                      <li key={href}>
                        <Link to={href} className="ri-service-card">
                          <span className="ri-icon"><Icon size={22} aria-hidden="true" /></span>
                          <span><strong>{name}</strong><span>{summary}</span></span>
                          <ArrowRight className="ri-card-arrow" size={20} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ri-section" aria-labelledby="service-scope-title">
          <div className="section-container ri-split">
            <div className="ri-copy">
              <h2 id="service-scope-title">Qué podemos sumar a tu proyecto</h2>
              <p>La propuesta define qué entregamos, qué herramientas conectamos y qué soporte incluye cada servicio.</p>
            </div>
            <div className="ri-ruled-list">
              <div className="ri-copy"><h3>Identidad y contenido</h3><p>Logos e identidad visual, piezas para redes, presentaciones, material impreso y secuencias de correo segmentadas.</p></div>
              <div className="ri-copy"><h3>Operación y seguimiento</h3><p>CRM, agendamiento, notificaciones, seguimiento multicanal, gestión de reseñas y reportes según el alcance.</p></div>
            </div>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
