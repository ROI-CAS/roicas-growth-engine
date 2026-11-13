import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, SlidersHorizontal, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "100% Automatizado",
    description: "Sistemas activos 24/7 sin cuellos de botella manuales",
  },
  {
    icon: SlidersHorizontal,
    title: "Arquitectura a la Medida",
    description: "Ingeniería adaptada a tu modelo de negocio y márgenes",
  },
  {
    icon: BarChart3,
    title: "ROI Medible en Pesos (COP)",
    description: "Trazabilidad exacta de cada peso invertido en adquisición",
  },
  {
    icon: ShieldCheck,
    title: "Cero Permanencias",
    description: "Nos ganamos tu continuidad mes a mes con resultados",
  },
];

export default function FeaturesStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="py-8 border-y border-border/80 bg-card/40 backdrop-blur-sm">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300 text-brand shadow-sm">
                <f.icon size={18} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground leading-tight">{f.title}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
