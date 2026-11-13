import { Check, X, Zap, Globe, Megaphone, Bot, ArrowRight, Info } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackPackageInterest } from "@/modules/diagnostico/lib/pixel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/diagnostico/components/ui/dialog";

const entryOffer = {
  badge: "Lanzamiento express",
  name: "One Page Express",
  price: "$350.000",
  suffix: "pago único",
  description:
    "No solo una página — tu negocio visto profesionalmente, listo para atraer clientes sin complicaciones.",
  tags: [
    "Lista para campañas",
    "Optimizada para captar clientes",
    "Preparada para Meta Ads",
    "Con medición de conversiones",
    "Enfocada en resultados",
  ],
  features: [
    "1 página orientada a conversión",
    "Diseño responsive y veloz",
    "Formulario de contacto",
    "Entrega en 2–3 días hábiles",
  ],
  includes: [
    "Integración del código de Meta Pixel en tu web",
    "Integración del código de Google Analytics 4 en tu web",
    "Verificación en Search Console mediante etiqueta (opcional)",
    "Activación de eventos: clic WhatsApp, formulario y botón CTA",
  ],
  includesNote:
    "Los códigos de seguimiento los genera el cliente desde sus propias cuentas en Meta y Google. Nosotros los integramos en la web.",
  notIncludes: [
    "Copywriting completo",
    "Branding o diseño de identidad",
    "SEO avanzado",
    "Múltiples rondas de revisión",
    "Animaciones complejas",
    "Blog o CMS",
    "Panel administrativo avanzado",
    "Integraciones CRM complejas",
    "Automatizaciones",
  ],
};

const packages = [
  {
    Icon: Globe,
    badge: "Más elegido",
    name: "Presencia Web",
    price: "$650.000",
    suffix: "pago único",
    description:
      "Tu negocio completo en la web. Dominio, correos y diseño profesional, listos en una semana.",
    featured: true,
    cta: "Quiero esta web",
    features: [
      "Web multipágina (Inicio, Nosotros, Servicios, Contacto)",
      "Dominio + hosting incluidos el primer año",
      "2 correos corporativos (@tudominio)",
      "Diseño responsive orientado a conversión",
      "Analítica básica configurada desde el día uno",
    ],
  },
  {
    Icon: Megaphone,
    badge: "Mayor retorno",
    name: "Gestión de Campañas",
    price: "Desde $800.000",
    suffix: "COP / mes",
    description:
      "Inversión publicitaria que se mide, ajusta y optimiza cada mes para maximizar tu retorno.",
    featured: false,
    cta: "Ver opciones",
    features: [
      "Gestión mensual en Google Ads y/o Meta Ads",
      "Segmentación, creativos y optimización continua",
      "Reportes claros con las métricas que importan",
      "Integración con tu CRM para medir conversiones reales",
      "Sin permanencia mínima",
    ],
  },
  {
    Icon: Bot,
    badge: "Sistema completo",
    name: "CRM + Ecosistema Digital",
    price: "Cotización",
    suffix: "a medida",
    description:
      "Todo lo que normalmente necesitas de 5 herramientas distintas, integrado en una sola plataforma.",
    featured: false,
    cta: "Agendar llamada",
    features: [
      "CRM centralizado: leads, clientes y seguimiento en un solo lugar",
      "Automatización por WhatsApp, email y SMS — 24/7, sin intervención manual",
      "Pipeline de ventas visual: sabes exactamente en qué etapa está cada cliente",
      "Google Analytics + Search Console configurados y conectados",
      "SEO inicial: velocidad, metaetiquetas e indexación en Google",
      "Integraciones: calendarios, pagos y reseñas",
    ],
  },
];

export function Packages() {
  return (
    <section id="paquetes" className="relative py-24 md:py-32">
      <div className="container">
        {/* Heading — left aligned for stronger hierarchy */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft/60">
              Precios
            </p>
            <h2 className="mt-3 text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
              Transparencia total,<br className="hidden md:block" /> sin sorpresas
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">
              Elige el servicio que necesitas hoy. Añade el siguiente cuando estés listo.
            </p>
          </div>
        </Reveal>

        {/* Entry offer — Web Onepage */}
        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-soft my-[50px]">
            <div className="flex flex-col gap-5 border-l-4 border-l-primary p-6 md:flex-row md:items-center md:justify-between md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {entryOffer.badge}
                  </span>
                  <p className="mt-0.5 font-display text-xl font-semibold text-ink">
                    {entryOffer.name}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">{entryOffer.description}</p>

                  {/* Benefit tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entryOffer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                    {entryOffer.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-ink-soft">
                        <Check className="h-3 w-3 shrink-0 text-primary" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Terms modal trigger */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft/70 underline-offset-4 hover:text-primary hover:underline transition-colors">
                        <Info className="h-3.5 w-3.5" />
                        Ver qué incluye y qué no
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-display text-xl font-semibold text-ink">
                          One Page Express — ¿Qué incluye?
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 space-y-5">
                        <div>
                          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                            Incluye
                          </p>
                          <ul className="space-y-2">
                            {entryOffer.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <Check className="h-2.5 w-2.5 text-primary" strokeWidth={2.5} />
                                </span>
                                <span className="text-sm text-ink">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-3 text-xs text-ink-soft/70 italic">
                            {entryOffer.includesNote}
                          </p>
                        </div>
                        <div className="border-t border-border pt-4">
                          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                            No incluye
                          </p>
                          <ul className="space-y-2">
                            {entryOffer.notIncludes.map((item) => (
                              <li key={item} className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink/6">
                                  <X className="h-2.5 w-2.5 text-ink-soft" strokeWidth={2.5} />
                                </span>
                                <span className="text-sm text-ink-soft">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-5 md:flex-col md:items-end md:gap-2">
                <p className="shrink-0">
                  <span className="font-display text-2xl font-bold text-ink">
                    {entryOffer.price}
                  </span>
                  <span className="ml-1.5 text-sm text-ink-soft">{entryOffer.suffix}</span>
                </p>
                <button
                  onClick={() => { trackPackageInterest("One Page Express"); scrollToId("contacto"); }}
                  className="group inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-[hsl(354,75%,32%)]"
                >
                  Me interesa
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3 service cards */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {packages.map(({ Icon, badge, name, price, suffix, description, features, featured, cta }, i) => (
            <Reveal key={name} delay={(i + 2) * 80}>
              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300",
                  featured
                    ? "border-ink bg-ink text-cream md:-translate-y-2 md:shadow-[0_20px_60px_-20px_hsl(20_14%_10%_/_0.35)]"
                    : "border-border bg-card shadow-soft hover:-translate-y-0.5 hover:shadow-card hover:border-ink/10"
                )}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                    {badge}
                  </span>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300",
                      featured
                        ? "bg-cream/10 text-cream group-hover:bg-primary group-hover:text-primary-foreground"
                        : "bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {!featured && (
                    <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      {badge}
                    </span>
                  )}
                </div>

                <h3
                  className={cn(
                    "mt-5 font-display text-xl font-semibold",
                    featured ? "text-cream" : "text-ink"
                  )}
                >
                  {name}
                </h3>
                <p
                  className={cn(
                    "mt-1.5 text-sm leading-relaxed",
                    featured ? "text-cream/70" : "text-ink-soft"
                  )}
                >
                  {description}
                </p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-display text-2xl font-bold",
                      featured ? "text-cream" : "text-ink"
                    )}
                  >
                    {price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      featured ? "text-cream/50" : "text-ink-soft"
                    )}
                  >
                    {suffix}
                  </span>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          featured ? "bg-primary/30" : "bg-primary/10"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-2.5 w-2.5",
                            featured ? "text-cream" : "text-primary"
                          )}
                          strokeWidth={2.5}
                        />
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-snug",
                          featured ? "text-cream/75" : "text-ink"
                        )}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => { trackPackageInterest(name); scrollToId("contacto"); }}
                  className={cn(
                    "mt-7 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5",
                    featured
                      ? "bg-primary text-primary-foreground hover:bg-[hsl(354,75%,32%)]"
                      : "border border-border bg-background text-ink hover:border-ink/20 hover:bg-card"
                  )}
                >
                  {cta}
                </button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={380}>
          <p className="mt-8 text-center text-sm text-ink-soft/70">
            Sin permanencia · Sin cargos ocultos · Puedes combinar servicios
          </p>
        </Reveal>
      </div>
    </section>
  );
}
