import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Clock, Shield } from "lucide-react";
import { Reveal } from "./Reveal";

const CALENDAR_ID = "gEm0YwOkG4AarjCYtCq9";
const CALENDAR_URL = `https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}`;
const SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

const trustItems = [
  { Icon: Clock, label: "20 minutos" },
  { Icon: CalendarCheck, label: "Sin costo" },
  { Icon: Shield, label: "Sin compromiso" },
];

export function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const scriptLoaded = useRef(false);
  const [visible, setVisible] = useState(false);

  // Defer script + iframe until user scrolls near this section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || scriptLoaded.current) return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    scriptLoaded.current = true;
  }, [visible]);

  return (
    <section id="agenda" ref={sectionRef} className="relative py-20 md:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-64 w-[48rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mt-3 text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
              Reserva una llamada de 20 minutos
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Cuéntanos tu situación, aclaremos tus prioridades y definamos el siguiente paso. La implementación se cotiza por separado.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
              {trustItems.map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {visible ? (
              <iframe
                src={CALENDAR_URL}
                style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "660px" }}
                scrolling="no"
                id={`${CALENDAR_ID}_1778528488270`}
                title="Agenda tu llamada con Roicas"
              />
            ) : (
              <div
                className="w-full animate-pulse bg-cream-deep/60"
                style={{ minHeight: "660px" }}
                aria-hidden
              />
            )}
          </div>
        </Reveal>
        <p className="mt-5 text-center text-sm text-ink-soft">Si el calendario no carga, <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">ábrelo en otra ventana</a>.</p>
      </div>
    </section>
  );
}
