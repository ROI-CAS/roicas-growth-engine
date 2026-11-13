import { ArrowRight, ArrowUpRight, ClipboardCheck, MessagesSquare, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import Footer from "@/components/Footer";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import logoFalcon from "@/assets/clients/falcon-cloud.png";
import logoComponenteLegal from "@/assets/clients/componente-legal.png";
import logoTorregroza from "@/assets/clients/torregroza-diazgranados.png";
import logoEcosfera from "@/assets/clients/ecosfera.png";
import logoAeroAmbulancias from "@/assets/clients/aero-ambulancias.jpg";
import logoFindolor from "@/assets/clients/findolor.png";
import "./institutional.css";

const clients = [
  { name: "Falcon Cloud", logo: logoFalcon, url: "https://www.falconcloud.co/", sector: "Gestión de personal" },
  { name: "Ecosfera", logo: logoEcosfera, url: "https://www.grupoecosfera.com/", sector: "Consultoría estratégica" },
  { name: "Componente Legal", logo: logoComponenteLegal, url: "https://www.componentelegal.com/", sector: "Tecnología legal" },
  { name: "Torregroza & Diazgranados", logo: logoTorregroza, sector: "Servicios jurídicos" },
  { name: "Aero Ambulancias", logo: logoAeroAmbulancias, url: "https://aeroambulanciassas.com/", sector: "Salud" },
  { name: "FinDolor", logo: logoFindolor, url: "https://www.findolor.com/", sector: "Salud" },
];

const approach = [
  { icon: ClipboardCheck, title: "Acordamos el alcance contigo", description: "Revisamos tu situación y definimos en la propuesta qué se entrega, en qué plazo y con qué soporte." },
  { icon: Workflow, title: "Conectamos el trabajo de cada canal", description: "Coordinamos la web, la captación y el seguimiento comercial según las necesidades de tu proyecto." },
  { icon: MessagesSquare, title: "Revisamos lo que sucede después", description: "Cuando el servicio incluye medición, revisamos indicadores como consultas, citas o ventas para orientar las mejoras." },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Nosotros | Agencia de marketing digital en Colombia | ROICAS" description="Conoce cómo trabaja Roicas, agencia de marketing digital en Colombia. Conectamos diseño web, captación y automatización comercial." canonical="https://roicas.com/nosotros" />
      <Header />
      <main id="contenido-principal" className="roicas-institutional">
        <section className="ri-hero ri-about-hero" aria-labelledby="about-title">
          <ParticlesBackground particleCount={30} speed={0.25} className="opacity-60" />
          <div className="section-container ri-hero-layout">
            <div className="ri-enter">
              <p className="ri-label">Agencia de marketing digital en Colombia</p>
              <h1 id="about-title">Somos <span>Roicas</span></h1>
              <p className="ri-hero-lead">Reunimos diseño web, marketing digital y automatización comercial para ayudar a empresas a organizar cómo se presentan, atraen clientes y atienden sus consultas.</p>
              <div className="ri-actions">
                <a href="#como-trabajamos" className="ri-button ri-button-light">Ver cómo trabajamos <ArrowRight size={18} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="como-trabajamos" className="ri-section" aria-labelledby="about-approach-title">
          <div className="section-container ri-split">
            <div className="ri-copy">
              <h2 id="about-approach-title">Cómo trabajamos contigo</h2>
              <p>El punto de partida es entender qué necesita tu empresa y qué puedes aprovechar de lo que ya tienes.</p>
            </div>
            <ul className="ri-ruled-list">
              {approach.map(({ icon: Icon, title, description }) => (
                <li className="ri-approach-item" key={title}>
                  <span className="ri-icon"><Icon size={22} aria-hidden="true" /></span>
                  <div className="ri-copy"><h3>{title}</h3><p>{description}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ri-section ri-paper" aria-labelledby="about-clients-title">
          <div className="section-container">
            <h2 id="about-clients-title" className="ri-section-heading">Empresas con las que hemos trabajado</h2>
            <ul className="ri-client-grid">
              {clients.map(({ name, logo, url, sector }) => {
                const content = <><img src={logo} alt="" width={140} height={64} loading="lazy" decoding="async" /><strong>{name}</strong><span>{sector}</span></>;
                return (
                  <li key={name}>
                    {url ? <a className="ri-client" href={url} target="_blank" rel="noopener noreferrer">{content}<ArrowUpRight size={16} aria-hidden="true" /></a> : <div className="ri-client">{content}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="ri-section ri-band" aria-labelledby="about-contact-title">
          <div className="section-container ri-band-layout">
            <div className="ri-copy"><h2 id="about-contact-title">Hablemos de tu proyecto</h2><p>Cuéntanos qué necesitas resolver y revisemos por dónde empezar.</p></div>
            <Link to="/contacto" className="ri-button ri-button-light">Contactar a Roicas <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
