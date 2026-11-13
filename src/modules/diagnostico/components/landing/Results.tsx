import { TrendingUp, Users, MousePointer, DollarSign } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";
import caseImg from "@/modules/diagnostico/assets/lapto.webp";

const metrics = [
  { icon: Users, value: "307", label: "contactos nuevos captados" },
  { icon: TrendingUp, value: "27.710", label: "visitantes al sitio web" },
  { icon: MousePointer, value: "6.860", label: "clics desde Google Ads" },
  { icon: DollarSign, value: "$2.93M → $9.14M", label: "COP invertidos / ingresos ganados" },
];


export function Results() {
  return (
    <section id="resultados" className="relative py-24 md:py-32 bg-cream-deep/40">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Resultados reales
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Lo que logramos para nuestros clientes
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <article className="relative mx-auto mt-14 max-w-6xl overflow-hidden rounded-[2rem] bg-ink p-8 text-cream shadow-card md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream/80">
                    Caso de estudio · Sector salud
                  </span>
                  <span className="text-sm text-cream/70">60 días</span>
                </div>

                <h3 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-cream md:text-4xl text-balance">
                  Sistema digital con IA: web + campañas + CRM + automatización inteligente
                </h3>
                <p className="mt-4 text-base leading-relaxed text-cream/80 md:text-lg">
                  Integramos inteligencia artificial en el seguimiento, calificación y respuesta automática de leads, para que tu equipo solo invierta tiempo en quienes están listos para comprar.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-5 transition-colors hover:bg-cream/[0.08]"
                    >
                      <div className="flex items-center gap-2 text-primary-glow">
                        <m.icon className="h-4 w-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Métrica</span>
                      </div>
                      <p className="mt-2 font-display text-2xl font-extrabold text-cream md:text-3xl">
                        {m.value}
                      </p>
                      <p className="mt-1 text-xs text-cream/75">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <SmartImage
                  src={caseImg}
                  alt="Mockup del caso de estudio: web médica en laptop y móvil"
                  wrapperClassName="rounded-2xl"
                  className="h-full w-full object-cover"
                  width={1280}
                  height={960}
                />
              </div>
            </div>
          </article>
        </Reveal>

      </div>
    </section>
  );
}
