import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Facebook, Instagram, Linkedin, Search, Mail, Phone, Users, Target, Calendar, Handshake, ArrowDown } from "lucide-react";
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
    bgClass: "bg-blue-500",
    sideLabel: "Optimización del embudo",
    width: 100,
  },
  {
    icon: Target,
    label: "Leads Cualificados",
    value: 1014,
    percentage: 21,
    bgClass: "bg-emerald-500",
    sideLabel: "Calificación Avanzada con IA",
    width: 75,
  },
  {
    icon: Calendar,
    label: "Citas Agendadas",
    value: 289,
    percentage: 6,
    bgClass: "bg-amber-500",
    sideLabel: "Automatización Inteligente",
    width: 50,
  },
  {
    icon: Handshake,
    label: "Clientes Cerrados",
    value: 87,
    percentage: 1.8,
    bgClass: "bg-rose-500",
    sideLabel: "Conversión Predecible",
    width: 30,
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
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-sm"
              >
                <div className={`w-6 h-6 rounded-full ${source.color} flex items-center justify-center`}>
                  <source.icon size={12} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-300">{source.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Funnel Visualization */}
          <div className="space-y-3">
            {funnelStages.map((stage, index) => {
              const isLast = index === funnelStages.length - 1;

              return (
                <div key={stage.label} className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-center"
                  >
                    {/* Side Label - Left */}
                    <div className="hidden lg:block w-40 text-right pr-6">
                      <p className="text-sm font-medium text-slate-400">{stage.sideLabel}</p>
                    </div>

                    {/* Funnel Bar */}
                    <div
                      className={`${stage.bgClass} rounded-xl py-5 px-6 flex items-center justify-between shadow-lg`}
                      style={{ width: `${stage.width}%`, minWidth: '280px' }}
                    >
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <stage.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium opacity-80">{stage.label}</p>
                          <p className="text-xl font-bold">
                            <AnimatedCounter end={stage.value} />
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Percentage - Right */}
                    <div className="w-24 pl-4 text-left">
                      <p className="text-xl font-bold text-white">{stage.percentage}%</p>
                      <p className="text-xs text-slate-500">del total</p>
                    </div>
                  </motion.div>

                  {/* Connector Arrow */}
                  {!isLast && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto"
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

              {/* Mini chart */}
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-1 h-12">
                  {[35, 50, 40, 65, 55, 80, 70, 90].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-500 to-emerald-400 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400">Retorno sobre</p>
                  <p className="text-xs font-medium text-slate-400">Inversión Elevado</p>
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
