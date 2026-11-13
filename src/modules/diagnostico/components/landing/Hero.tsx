import { ArrowRight, CalendarCheck } from "lucide-react";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { Button } from "@/modules/diagnostico/components/ui/button";
import { scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackNavCTA } from "@/modules/diagnostico/lib/pixel";

export function Hero() {
  return (
    <section id="inicio" className="diagnostic-hero product-diagnostic-hero" aria-labelledby="diagnostic-title">
      <ParticlesBackground particleCount={24} speed={0.22} />
      <div className="container product-diagnostic-hero__inner">
        <div>
          <h1 id="diagnostic-title" className="font-display product-diagnostic-hero__title">
            Diagnóstico digital <span>para tu negocio.</span>
          </h1>
          <p className="product-diagnostic-hero__lead">Revisamos contigo tu web, tus campañas y cómo atiendes las consultas. Recibes orientación sobre qué conviene mejorar primero.</p>
          <div className="product-diagnostic-hero__actions">
            <Button type="button" size="lg" variant="inverse" onClick={() => { trackNavCTA("hero_auditoria"); scrollToId("checkup"); }}>
              Solicitar diagnóstico gratuito <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button type="button" size="lg" variant="inverse-outline" onClick={() => { trackNavCTA("hero_agenda"); scrollToId("agenda"); }}>
              <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Agendar llamada de 20 min
            </Button>
          </div>
          <p className="product-diagnostic-hero__note">La revisión empieza con una conversación sin compromiso. Si necesitas ayuda para implementar mejoras, preparamos una propuesta aparte.</p>
        </div>
        <img
          src="/products/diagnostico/banner_hero.webp"
          srcSet="/products/diagnostico/banner_hero-480.webp 480w, /products/diagnostico/banner_hero-720.webp 720w, /products/diagnostico/banner_hero.webp 1024w"
          alt="Una empresaria trabaja frente a su portátil"
          className="diagnostic-hero__image product-diagnostic-hero__image"
          width={1024}
          height={1280}
          sizes="(max-width: 767px) 100vw, 40vw"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
}
