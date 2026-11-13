import { Check, X, Minus } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackNavCTA } from "@/modules/diagnostico/lib/pixel";

type Cell = "yes" | "no" | "partial";

const columns = [
  { key: "roicas",      label: "ROICAS",             sub: null,          highlight: true },
  { key: "agency",      label: "Agencia",             sub: "tradicional", highlight: false },
  { key: "freelancer",  label: "Freelancer",          sub: null,          highlight: false },
  { key: "diy",         label: "Hazlo",               sub: "tú solo",     highlight: false },
] as const;

type ColKey = typeof columns[number]["key"];

const rows: ({ feature: string } & Record<ColKey, Cell>)[] = [
  { feature: "Estrategia personalizada",              roicas: "yes", agency: "partial", freelancer: "no",      diy: "no"  },
  { feature: "CRM + automatización incluida",         roicas: "yes", agency: "no",      freelancer: "no",      diy: "no"  },
  { feature: "Resultados medibles desde el día 1",   roicas: "yes", agency: "partial", freelancer: "partial", diy: "no"  },
  { feature: "Sin permanencias forzadas",             roicas: "yes", agency: "no",      freelancer: "yes",     diy: "yes" },
  { feature: "Equipo multidisciplinar (SEO + Ads + Web)", roicas: "yes", agency: "yes", freelancer: "no",     diy: "no"  },
  { feature: "Respuesta en menos de 24 h",            roicas: "yes", agency: "no",      freelancer: "partial", diy: "yes" },
  { feature: "ROI documentado y reportes claros",     roicas: "yes", agency: "partial", freelancer: "no",      diy: "no"  },
  { feature: "Precio ajustado a PyMEs",               roicas: "yes", agency: "no",      freelancer: "yes",     diy: "yes" },
];

const cellStyles: Record<Cell, { icon: typeof Check; bg: string; icon_cls: string }> = {
  yes:     { icon: Check, bg: "bg-emerald-500", icon_cls: "text-white" },
  partial: { icon: Minus, bg: "bg-amber-400",   icon_cls: "text-white" },
  no:      { icon: X,     bg: "bg-red-400",      icon_cls: "text-white" },
};

function CellIcon({ value }: { value: Cell }) {
  const { icon: Icon, bg, icon_cls } = cellStyles[value];
  return (
    <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full", bg)}>
      <Icon className={cn("h-4 w-4", icon_cls)} strokeWidth={2.5} />
    </span>
  );
}

export function Comparison() {
  return (
    <section className="relative py-24 md:py-32 bg-cream-deep/40">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Compara y decide
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              ¿Por qué Roicas y no otra opción?
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-5 font-display text-sm font-bold text-ink">
                      Qué obtienes
                    </th>
                    {columns.map((col) => (
                      <th key={col.key} className="p-5 text-center">
                        {col.highlight ? (
                          <span className="font-display text-base font-bold text-primary">
                            {col.label}
                          </span>
                        ) : (
                          <span className="flex flex-col items-center leading-tight">
                            <span className="font-display text-sm font-semibold text-ink-soft/70">
                              {col.label}
                            </span>
                            {col.sub && (
                              <span className="text-xs text-ink-soft/50">{col.sub}</span>
                            )}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.feature}
                      className={cn(
                        "border-b border-border last:border-b-0 transition-colors",
                        i % 2 === 1 ? "bg-cream-deep/20" : "bg-card"
                      )}
                    >
                      <td className="p-5 text-sm font-medium text-ink">{r.feature}</td>
                      {columns.map((col) => (
                        <td key={col.key} className="p-5 text-center">
                          <CellIcon value={r[col.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend + CTA */}
            <div className="flex flex-col items-start justify-between gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                  </span>
                  Incluido
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
                    <Minus className="h-3 w-3 text-white" strokeWidth={2.5} />
                  </span>
                  Parcialmente
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-400">
                    <X className="h-3 w-3 text-white" strokeWidth={2.5} />
                  </span>
                  No incluido
                </span>
              </div>
              <button
                onClick={() => { trackNavCTA("comparison_cta"); scrollToId("contacto"); }}
                className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-[hsl(354,75%,32%)]"
              >
                Empieza con Roicas hoy
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
