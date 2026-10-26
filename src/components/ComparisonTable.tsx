import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const rows = [
  {
    feature: "Estrategia personalizada",
    roicas: true,
    agencia: "partial",
    freelancer: false,
    diy: false,
  },
  {
    feature: "CRM + automatización incluida",
    roicas: true,
    agencia: false,
    freelancer: false,
    diy: false,
  },
  {
    feature: "Resultados medibles desde el día 1",
    roicas: true,
    agencia: "partial",
    freelancer: "partial",
    diy: false,
  },
  {
    feature: "Sin permanencias forzadas",
    roicas: true,
    agencia: false,
    freelancer: true,
    diy: true,
  },
  {
    feature: "Equipo multidisciplinar (SEO + Ads + Web)",
    roicas: true,
    agencia: true,
    freelancer: false,
    diy: false,
  },
  {
    feature: "Respuesta en menos de 24 h",
    roicas: true,
    agencia: false,
    freelancer: "partial",
    diy: true,
  },
  {
    feature: "ROI documentado y reportes claros",
    roicas: true,
    agencia: "partial",
    freelancer: false,
    diy: false,
  },
  {
    feature: "Precio ajustado a PYMES",
    roicas: true,
    agencia: false,
    freelancer: true,
    diy: true,
  },
] as const;

type CellValue = boolean | "partial";

const Cell = ({ value }: { value: CellValue }) => {
  if (value === true)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600">
        <Check size={14} strokeWidth={2.5} />
      </span>
    );
  if (value === "partial")
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-500">
        <Minus size={14} strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-500">
      <X size={14} strokeWidth={2.5} />
    </span>
  );
};

const ComparisonTable = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Comparativa
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Por qué ROICAS y no otra opción?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No todas las soluciones son iguales. Compara y decide con criterio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="overflow-x-auto rounded-2xl border border-border shadow-card"
        >
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-6 py-4 font-semibold text-foreground w-[38%]">
                  Qué obtienes
                </th>
                <th className="px-4 py-4 text-center font-bold text-brand w-[16%]">
                  <span className="block text-base">ROICAS</span>
                </th>
                <th className="px-4 py-4 text-center font-medium text-muted-foreground w-[16%]">
                  <span className="block">Agencia</span>
                  <span className="block text-xs font-normal">tradicional</span>
                </th>
                <th className="px-4 py-4 text-center font-medium text-muted-foreground w-[15%]">
                  <span className="block">Freelancer</span>
                </th>
                <th className="px-4 py-4 text-center font-medium text-muted-foreground w-[15%]">
                  <span className="block">Hazlo</span>
                  <span className="block text-xs font-normal">tú solo</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`transition-colors hover:bg-accent/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="px-6 py-3.5 font-medium text-foreground">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">
                      <Cell value={row.roicas} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">
                      <Cell value={row.agencia} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">
                      <Cell value={row.freelancer} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">
                      <Cell value={row.diy} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Legend + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 items-center justify-center">
                <Check size={11} className="text-emerald-600" strokeWidth={2.5} />
              </span>
              Incluido
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-5 h-5 rounded-full bg-amber-100 items-center justify-center">
                <Minus size={11} className="text-amber-500" strokeWidth={2.5} />
              </span>
              Parcialmente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-5 h-5 rounded-full bg-rose-100 items-center justify-center">
                <X size={11} className="text-rose-500" strokeWidth={2.5} />
              </span>
              No incluido
            </span>
          </div>

          <Button variant="hero" size="lg" asChild>
            <a href="/contacto">Empieza con ROICAS hoy</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
