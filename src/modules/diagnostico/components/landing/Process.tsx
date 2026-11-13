import { PhoneCall, FileText, Code2, Rocket } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    Icon: PhoneCall,
    title: "Llamada de diagnóstico",
    desc: "Conversamos sin compromiso para entender tu negocio, objetivos y dónde estás hoy.",
  },
  {
    Icon: FileText,
    title: "Propuesta a medida",
    desc: "Te enviamos un plan claro con alcance, tiempos e inversión. Sin letra pequeña.",
  },
  {
    Icon: Code2,
    title: "Ejecución por etapas",
    desc: "Diseñamos, desarrollamos y lanzamos con entregas semanales. Tú aprueba cada hito.",
  },
  {
    Icon: Rocket,
    title: "Lanzamiento + acompañamiento",
    desc: "Publicamos, medimos, ajustamos y te acompañamos para que el sistema siga creciendo.",
  },
];

export function Process() {
  return (
    <section id="proceso" className="relative py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Cómo trabajamos
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Un proceso claro, sin sorpresas
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              De la primera llamada al lanzamiento en 4 pasos simples.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-14">
          {/* Connector line desktop */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[60px] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block"
          />

          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="group relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-[120px] w-[120px] items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 ring-1 ring-primary/15 shadow-brand transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]">
                    <s.Icon className="h-12 w-12 text-primary" strokeWidth={1.75} />
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-xs font-extrabold text-cream ring-4 ring-background">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
