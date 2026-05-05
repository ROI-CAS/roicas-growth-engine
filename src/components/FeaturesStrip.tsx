import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, SlidersHorizontal, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    bg: "bg-amber-400",
    title: "Completamente automatizado",
    description: "funciona 24/7 sin trabajo manual",
  },
  {
    icon: SlidersHorizontal,
    bg: "bg-rose-500",
    title: "Diseñado a tu medida",
    description: "sin soluciones genéricas de agencia",
  },
  {
    icon: BarChart3,
    bg: "bg-teal-500",
    title: "ROI medible desde el mes 1",
    description: "sabes exactamente qué genera cada peso",
  },
  {
    icon: Shield,
    bg: "bg-zinc-700",
    title: "Sin permanencias",
    description: "nos quedamos porque funciona, no por contrato",
  },
];

const FeaturesStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="py-10 border-b border-border bg-background">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-3 group"
            >
              {/* Solid color icon square — LottieFiles style */}
              <div
                className={`${f.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200`}
              >
                <f.icon size={18} className="text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesStrip;
