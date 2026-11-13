import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    name: "Diana Garzón",
    role: "Clínica FinDolor",
    quote:
      "Pasamos de no aparecer en Google a recibir solicitudes de cita todos los días. El proceso fue claro y los resultados, medibles desde el primer mes.",
    initials: "DG",
  },
  {
    name: "Diego Vivas",
    role: "Gerente · Componente Legal",
    quote:
      "Lo que más valoro es el trato directo y la honestidad. No prometen humo: muestran datos. Nuestra web ahora trabaja para nosotros 24/7.",
    initials: "DV",
  },
  {
    name: "Sebastián",
    role: "Director · Grupo Ecosfera",
    quote:
      "Antes perdíamos contactos por demoras, hoy todos reciben respuesta en minutos.",
    initials: "S",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Lo que dicen los clientes
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Resultados reales, en sus palabras
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <article className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft hover-lift">
                <Quote className="h-8 w-8 text-primary/30" />
                <div className="mt-3 flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-base leading-relaxed text-ink">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-warm font-display text-sm font-extrabold text-primary-foreground shadow-brand">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.role}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
