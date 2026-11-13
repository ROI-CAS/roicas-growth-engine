import { Bot, Globe2, RefreshCw, Target } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";
import mockup from "@/modules/diagnostico/assets/banner_servicios_web.webp";
import mockup480 from "@/modules/diagnostico/assets/banner_servicios_web-480.webp";
import mockup720 from "@/modules/diagnostico/assets/banner_servicios_web-720.webp";

const services = [
  {
    icon: Globe2,
    title: "Diseño y desarrollo web profesional",
    desc: "Creamos sitios web rápidos, responsivos y enfocados en conversión. La página web básica del paquete Presencia se entrega en 3 a 4 días hábiles. Incluye dominio y hosting el primer año.",
  },
  {
    icon: RefreshCw,
    title: "Rediseño web",
    desc: "¿Tienes web pero está desactualizada o no convierte? La renovamos por completo con foco en velocidad y conversión.",
  },
  {
    icon: Target,
    title: "Campañas pagas (Google Ads y Meta Ads)",
    desc: "Creamos y gestionamos tus campañas en Google, Facebook e Instagram para que aparezcas justo cuando tu cliente te está buscando.",
  },
  {
    icon: Bot,
    title: "CRM + Automatización con IA ",
    desc: "Implementamos un sistema con inteligencia artificial que captura, califica y responde automáticamente a cada cliente potencial 24/7. Se cotiza aparte según el alcance y los flujos que necesite tu negocio.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="relative py-24 md:py-32 bg-cream-deep/30">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
              <span className="h-px w-6 bg-ink-soft/40" />
              Lo que hacemos
              <span className="h-px w-6 bg-ink-soft/40" />
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Servicios diseñados para hacer crecer tu negocio
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative">
                <SmartImage
                  src={mockup}
                  srcSet={`${mockup480} 480w, ${mockup720} 720w, ${mockup} 1024w`}
                  alt="Servicios de diseño web profesional, SEO, marketing digital y crecimiento online"
                  wrapperClassName="rounded-3xl border hairline bg-card shadow-card"
                  className="block w-full h-auto lg:h-[809px] lg:object-cover lg:object-center"
                  width={1080}
                  height={1456}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <article className="group relative rounded-2xl border hairline bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card hover:border-ink/15">
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                      <p className="mt-2 text-[15px] leading-[1.65] text-ink-soft">{s.desc}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
