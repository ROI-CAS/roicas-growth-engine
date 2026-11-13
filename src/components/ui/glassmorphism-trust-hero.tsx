import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import ParticlesBackground from "./ParticlesBackground";
import "../hero-banner.css";

const poster = "/hero/roicas-hero-poster.webp";

export default function HeroSection() {
  const { openBooking } = useBooking();
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    let visible = true;
    const sync = () => {
      const allowed = !mobile.matches && !motion.matches && !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
      if (!allowed || document.hidden || !visible) { el.pause(); return; }
      if (!el.dataset.sourcesLoaded) {
        el.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach((source) => {
          const src = source.dataset.src;
          if (src) source.src = src;
        });
        el.dataset.sourcesLoaded = "true";
        el.load();
      }
      void el.play().catch(() => { /* Video autoplay fallback */ });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    if (section.current) observer?.observe(section.current);
    motion.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer?.disconnect(); motion.removeEventListener("change", sync); mobile.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); el.pause(); };
  }, []);

  return (
    <section ref={section} className="roicas-banner" aria-labelledby="home-title">
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
            <a className="rb-whatsapp" href="https://wa.me/573114565403?text=Hola%20Roicas%2C%20quiero%20conocer%20m%C3%A1s%20sobre%20sus%20servicios%20de%20desarrollo%20y%20marketing" target="_blank" rel="noopener noreferrer" onClick={() => trackCtaClicked("Escribir por WhatsApp", "hero")}><MessageCircle size={18} aria-hidden="true" /><span>Hablemos por WhatsApp</span><ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <p className="rb-reassurance">Consultoría gratuita · 20 minutos · Sin compromiso · Tu web 100% tuya</p>
        </div>
        <div className="rb-background" aria-hidden="true">
          <video ref={video} poster={poster} muted playsInline loop preload="none" tabIndex={-1}>
            <source data-src="/hero/roicas-hero-keyed.webm" type="video/webm" />
            <source data-src="/hero/roicas-hero-desktop.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

    </section>
  );
}
