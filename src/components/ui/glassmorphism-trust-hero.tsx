import { ArrowRight } from "lucide-react";
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
          <h1 id="home-title">Tu sistema de<br />crecimiento digital,<br /><span>de la atracción al cierre</span></h1>
          <picture>
            <source media="(min-width: 768px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
            <img
              className="rb-placeholder"
              src="/images/services/hero-home-mobile.webp"
              width={1080}
              height={1080}
              alt="Estrategia digital 360 grados para empresas"
              decoding="async"
            />
          </picture>
          <p className="rb-description">Estructuramos tu canal digital de punta a punta: combinamos estrategia comercial, SEO, pauta en Google y Meta y flujos automatizados en CRM para atraer mejores prospectos y darles seguimiento real.</p>
          <ul className="rb-proof-points" aria-label="Pilares del sistema de crecimiento">
            <li><span className="rb-proof-check" aria-hidden="true" />Estrategia y embudo comercial</li>
            <li><span className="rb-proof-check" aria-hidden="true" />SEO, Google y Meta Ads</li>
            <li><span className="rb-proof-check" aria-hidden="true" />Automatización con WhatsApp y CRM</li>
          </ul>
          <div className="rb-actions">
            <button className="rb-cta" type="button" onClick={() => { trackCtaClicked("Agendar consultoría", "hero"); openBooking(); }}><span>Agendar consultoría</span><span className="rb-arrow"><ArrowRight size={18} aria-hidden="true" /></span></button>
          </div>
          <p className="rb-reassurance">Consultoría gratuita · 20 minutos · Sin compromiso</p>
        </div>
      </div>
    </section>
  );
}
