import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, Search, Mail, Phone, Users, Target, Calendar, Handshake, ArrowRight, ArrowDown } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import Lottie from "lottie-react";

const TROPHY_URL = "https://assets2.lottiefiles.com/packages/lf20_touohxv0.json";

const sources = [
  { icon: Search, label: "Google Ads", color: "bg-amber-500" },
  { icon: Facebook, label: "Facebook", color: "bg-blue-600" },
  { icon: Instagram, label: "Instagram", color: "bg-pink-500" },
  { icon: Linkedin, label: "LinkedIn", color: "bg-blue-700" },
  { icon: Mail, label: "Email", color: "bg-emerald-500" },
  { icon: Phone, label: "Teléfono", color: "bg-slate-400" },
];

const funnelStages = [
  { icon: Users, label: "Leads Captados", value: 4827, percentage: 100, color: "from-blue-500 to-indigo-600", border: "border-blue-400/30", glow: "shadow-blue-500/20" },
  { icon: Target, label: "Leads Cualificados", value: 1014, percentage: 21, color: "from-emerald-400 to-teal-600", border: "border-emerald-400/30", glow: "shadow-emerald-500/20" },
  { icon: Calendar, label: "Citas Agendadas", value: 289, percentage: 6, color: "from-amber-400 to-orange-500", border: "border-amber-400/30", glow: "shadow-amber-500/20" },
  { icon: Handshake, label: "Clientes Cerrados", value: 87, percentage: 1.8, color: "from-rose-400 to-pink-600", border: "border-rose-400/30", glow: "shadow-rose-500/20" },
];

const FunnelSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [trophyAnim, setTrophyAnim] = useState<object | null>(null);

  useEffect(() => {
    fetch(TROPHY_URL)
      .then((r) => r.json())
      .then(setTrophyAnim)
      .catch(() => null);
  }, []);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {trophyAnim && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 150 }}
              className="flex justify-center mb-4 pointer-events-none"
            >
              <Lottie animationData={trophyAnim} loop style={{ width: 150, height: 150 }} />
            </motion.div>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Así convertimos{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              visitas en clientes
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            No importa de dónde lleguen tus leads. Nuestro sistema los captura,
            los cualifica y los acompaña hasta que estén listos para hablar contigo.
          </p>
        </motion.div>

        {/* Traffic sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {sources.map((source, index) => (
            <motion.div
              key={source.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full ${source.color} flex items-center justify-center`}>
                <source.icon size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-200">{source.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated arrows flowing down */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-3">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              >
                <ArrowDown className="w-5 h-5 text-blue-400/60" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stage cards — horizontal grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {funnelStages.map((stage, index) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border ${stage.border} shadow-2xl overflow-hidden`}
              >
                {/* Top gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stage.color} rounded-t-2xl`} />

                {/* Background glow */}
                <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${stage.color} opacity-10 rounded-full blur-2xl`} />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <stage.icon size={22} className="text-white" />
                </div>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {stage.label}
                </p>
                <p className="text-4xl font-black text-white mb-3">
                  <AnimatedCounter end={stage.value} />
                </p>

                <div className={`inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/10`}>
                  <span className="text-xs font-bold text-slate-200">{stage.percentage}% del total</span>
                </div>
              </motion.div>

              {/* Arrow connector between cards */}
              {index < funnelStages.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5 text-white/20" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Dramatic result card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-5">
                Resultado Final del Sistema
              </p>
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <span className="text-3xl md:text-4xl font-black text-white">$</span>
                <span className="text-6xl md:text-7xl font-black text-white leading-none">
                  <AnimatedCounter end={174} />
                </span>
                <span className="text-3xl md:text-4xl font-black text-white">K+</span>
              </div>
              <p className="text-slate-300 text-base mb-6">En ventas cerradas por clientes del sistema</p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-bold text-lg">
                  ROI promedio: <AnimatedCounter end={9} />x
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FunnelSection;
