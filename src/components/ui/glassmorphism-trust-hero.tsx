import { ArrowDown, ArrowRight } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import ParticlesBackground from "./ParticlesBackground";
import "../hero-banner.css";

export default function HeroSection() {
  const { openBooking } = useBooking();

  return (
    <section className="roicas-banner" aria-labelledby="home-title">
      <div className="rb-background" aria-hidden="true">
        <div className="rb-video-wrapper">
          <img
            src="/hero/banner_hero_home.png"
            alt=""
            width={1600}
            height={900}
            decoding="async"
            fetchPriority="high"
            className="rb-hero-video"
          />
          <div className="rb-video-overlay" aria-hidden="true" />
        </div>
      </div>
      <ParticlesBackground particleCount={50} speed={0.4} className="opacity-90 z-0" />
      <div className="rb-layout">
        <div className="rb-content">
          <p className="rb-badge"><span className="rb-badge-dot" aria-hidden="true" />Estrategia digital 360°</p>
          <h1 id="home-title">Estrategia de <span>marketing digital</span><br />para empresas que quieren crecer</h1>
          <picture>
            <source media="(min-width: 768px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
            <img
              className="rb-placeholder"
              src="/images/services/hero-home-mobile.webp"
              width={1080}
              height={1080}
              alt="Tienda online en computador y móvil con productos listos para comprar"
              decoding="async"
            />
          </picture>
          <p className="rb-description">No solo creamos tu presencia digital. Conectamos las herramientas que tu negocio necesita para atraer, convertir y gestionar clientes.</p>
          <ul className="rb-proof-points" aria-label="Cómo trabaja la estrategia digital">
            <li><span className="rb-proof-check" aria-hidden="true" />Presencia en buscadores</li>
            <li><span className="rb-proof-check" aria-hidden="true" />Seguimiento conectado</li>
            <li><span className="rb-proof-check" aria-hidden="true" />Medición de campañas</li>
          </ul>
          <div className="rb-actions">
            <button className="rb-cta" type="button" onClick={() => { trackCtaClicked("Agendar consultoría", "hero"); openBooking(); }}><span>Agendar consultoría</span><span className="rb-arrow"><ArrowRight size={18} aria-hidden="true" /></span></button>
            <a className="rb-whatsapp" href="#servicios"><span>Explorar soluciones</span><ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <p className="rb-reassurance">Consultoría gratuita · 20 minutos · Sin compromiso · Tu web 100% tuya</p>
        </div>
      </div>
    </section>
  );
}
