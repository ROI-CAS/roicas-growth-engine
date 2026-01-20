import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Facebook, Instagram, Linkedin, Search, Mail, Phone, Users, Target, Calendar, Handshake, ArrowDown, TrendingUp } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const sources = [
  { icon: Search, label: "Google Ads", color: "bg-amber-500" },
  { icon: Facebook, label: "Facebook", color: "bg-blue-600" },
  { icon: Instagram, label: "Instagram", color: "bg-pink-500" },
  { icon: Linkedin, label: "LinkedIn", color: "bg-blue-700" },
  { icon: Mail, label: "Email", color: "bg-emerald-500" },
  { icon: Phone, label: "Teléfono", color: "bg-slate-600" },
];

const funnelStages = [
  {
    icon: Users,
    label: "Leads Captados",
    value: 4827,
    percentage: 100,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-500",
    sideLabel: "Optimización del embudo",
  },
  {
    icon: Target,
    label: "Leads Cualificados",
    value: 1014,
    percentage: 21,
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-500",
    sideLabel: "Calificación Avanzada con IA",
  },
  {
    icon: Calendar,
    label: "Citas Agendadas",
    value: 289,
    percentage: 6,
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-500",
    sideLabel: "Automatización Inteligente",
  },
  {
    icon: Handshake,
    label: "Clientes Cerrados",
    value: 87,
    percentage: 1.8,
    color: "from-rose-400 to-rose-600",
    bgColor: "bg-rose-500",
    sideLabel: "Conversión Predecible",
  },
];

const FunnelSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-slate-900 overflow-hidden">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Así convertimos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              visitas en clientes
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No importa de dónde lleguen tus leads. Nuestro sistema los captura,
            los cualifica y los acompaña hasta que estén listos para hablar contigo.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Sources Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {sources.map((source, index) => (
              <motion.div
                key={source.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-sm hover:shadow-md hover:border-slate-600 transition-all"
              >
                <div className={`w-6 h-6 rounded-full ${source.color} flex items-center justify-center`}>
                  <source.icon size={12} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-300">{source.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Funnel Visualization */}
          <div className="relative">
            {funnelStages.map((stage, index) => {
              const widthPercent = 100 - index * 18;
              const isLast = index === funnelStages.length - 1;

              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="relative flex items-center justify-center mb-2"
                >
                  {/* Funnel Stage */}
                  <div
                    className="relative"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {/* 3D Funnel Shape */}
                    <div
                      className={`
                        relative bg-gradient-to-b ${stage.color} 
                        rounded-t-[50%] rounded-b-[30%]
                        py-6 px-6 md:py-8 md:px-8
                        shadow-2xl
                        border-t-4 border-white/20
                      `}
                      style={{
                        clipPath: isLast 
                          ? 'polygon(15% 0%, 85% 0%, 70% 100%, 30% 100%)'
                          : 'polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%)',
                      }}
                    >
                      {/* Inner content */}
                      <div className="flex items-center gap-3 text-white relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <stage.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium opacity-90">{stage.label}</p>
                          <p className="text-xl md:text-2xl font-bold">
                            <AnimatedCounter end={stage.value} />
                          </p>
                        </div>
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent rounded-t-[50%]" />
                    </div>

                    {/* Percentage badge - right side */}
                    <div className="absolute -right-16 md:-right-24 top-1/2 -translate-y-1/2 text-right">
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {stage.percentage}%
                      </p>
                      <p className="text-xs text-slate-400">del total</p>
                    </div>

                    {/* Side label - left side (desktop only) */}
                    <div className="hidden lg:block absolute -left-48 top-1/2 -translate-y-1/2 text-right w-40">
                      <p className="text-sm font-medium text-slate-300">{stage.sideLabel}</p>
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {!isLast && (
                    <motion.div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowDown className="w-6 h-6 text-slate-500" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-16 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto backdrop-blur-sm"
          >
            <p className="text-slate-400 mb-4 text-center text-sm">Resultados del Embudo</p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Main Result */}
              <div className="text-center md:text-left">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  $<AnimatedCounter end={174} />K+
                </p>
                <p className="text-slate-300">
                  En ventas cerradas con un ROI de{" "}
                  <span className="text-emerald-400 font-bold">
                    <AnimatedCounter end={9} />x
                  </span>
                </p>
              </div>

              {/* Chart illustration */}
              <div className="flex items-center gap-4">
                <div className="flex items-end gap-1 h-16">
                  {[40, 55, 45, 70, 60, 85, 75, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${height}%` } : {}}
                      transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
                      className="w-2 bg-gradient-to-t from-blue-500 to-emerald-400 rounded-t"
                    />
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-300">Retorno sobre</p>
                  <p className="text-sm font-medium text-slate-300">Inversión Elevado</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
