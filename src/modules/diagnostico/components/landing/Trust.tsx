import { CheckCircle2, Users, ShieldCheck, Zap } from "lucide-react";
import { Reveal } from "./Reveal";
import { LogoCloud } from "@/modules/diagnostico/components/ui/logo-cloud";
import logoTeBusiness from "@/modules/diagnostico/assets/logos/tebusiness.webp";
import logoFindolor from "@/modules/diagnostico/assets/logos/findolor.webp";
import logoAero from "@/modules/diagnostico/assets/logos/aeroambulancias.webp";
import logoComponente from "@/modules/diagnostico/assets/logos/componentelegal.webp";
import logoEcosfera from "@/modules/diagnostico/assets/logos/ecosfera.webp";
import logoFalcon from "@/modules/diagnostico/assets/logos/falcon.webp";
import logoTorregroza from "@/modules/diagnostico/assets/logos/torregroza.webp";
import logoEmkanativa from "@/modules/diagnostico/assets/logos/emkanativa.webp";

const items = [
  {
    icon: CheckCircle2,
    title: "Sin contratos forzosos",
    desc: "Trabajamos mes a mes. Te quedas porque te sirve, no porque te obliga un papel.",
  },
  {
    icon: Zap,
    title: "Entrega en 2–3 días hábiles",
    desc: "Aplica para la página web básica del paquete Presencia. Webs más complejas tienen tiempos definidos al cotizar.",
  },
  {
    icon: Users,
    title: "Comunicación directa",
    desc: "Hablas siempre con quien ejecuta tu proyecto, sin intermediarios ni teléfono descompuesto.",
  },
  {
    icon: ShieldCheck,
    title: "Satisfacción garantizada",
    desc: "Si no queda como esperabas, lo ajustamos hasta que sí.",
  },
];

const clientLogos = [
  { src: logoTeBusiness, alt: "tBusiness S.A.S" },
  { src: logoFindolor, alt: "Findolor" },
  { src: logoAero, alt: "Aero Ambulancias SAS" },
  { src: logoComponente, alt: "Componente Legal" },
  { src: logoEcosfera, alt: "Ecosfera" },
  { src: logoFalcon, alt: "Falcon Cloud" },
  { src: logoTorregroza, alt: "Torregroza & Diazgranados" },
  { src: logoEmkanativa, alt: "EmkaNativa" },
];

export function Trust() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Por qué Roicas</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Por qué los negocios eligen Roicas
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80}>
              <div className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <it.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{it.title}</h3>
                  <p className="mt-1 text-base text-ink-soft">{it.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Empresas que confían en Roicas */}
        <Reveal>
          <div className="mt-24 md:mt-32">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Clientes</p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
                Empresas que confían en Roicas
              </h2>
              <p className="mt-4 text-base text-ink-soft md:text-lg text-balance">
                Marcas de salud, derecho, tecnología y consultoría que ya crecen con nuestro sistema.
              </p>
            </div>

            <LogoCloud className="mt-14" logos={clientLogos} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
