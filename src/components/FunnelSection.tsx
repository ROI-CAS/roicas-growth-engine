import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, Search, Mail, Phone, Users, Target, Calendar, Handshake, ArrowDown } from "lucide-react";
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

// topOff / botOff = left (and right) margin % of the bar container
// top of stage[i] must equal bottom of stage[i-1]
const funnelStages = [
  { icon: Users,     label: "Leads Captados",     value: 4827, pct: 100,  topOff: 0,  botOff: 14, gradient: "linear-gradient(to bottom, #3b82f6, #4338ca)", bg: "bg-blue-500" },
  { icon: Target,    label: "Leads Cualificados",  value: 1014, pct: 21,   topOff: 14, botOff: 27, gradient: "linear-gradient(to bottom, #34d399, #0f766e)", bg: "bg-emerald-500" },
  { icon: Calendar,  label: "Citas Agendadas",     value: 289,  pct: 6,    topOff: 27, botOff: 37, gradient: "linear-gradient(to bottom, #fbbf24, #ea580c)", bg: "bg-amber-500" },
  { icon: Handshake, label: "Clientes Cerrados",   value: 87,   pct: 1.8,  topOff: 37, botOff: 43, gradient: "linear-gradient(to bottom, #f87171, #be185d)", bg: "bg-rose-500" },
];

const ROW_H = 88; // px per funnel stage

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
        {/* Header */}
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

        {/* Flowing arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mb-6"
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

        {/* ── Funnel chart ── */}
        <div className="max-w-3xl mx-auto mb-12">
          {funnelStages.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              className="grid items-center"
              style={{
                height: ROW_H,
                gridTemplateColumns: "44px 1fr 110px",
              }}
            >
              {/* Left — icon */}
              <div className="flex justify-center items-center h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1, type: "spring" }}
                  className={`w-8 h-8 rounded-lg ${stage.bg} flex items-center justify-center shadow-lg shrink-0`}
                >
                  <stage.icon size={14} className="text-white" />
                </motion.div>
              </div>

              {/* Center — trapezoid bar */}
              <div className="relative h-full">
                {/* Dim skeleton */}
                <div
                  className="absolute inset-0 bg-white/5"
                  style={{
                    clipPath: `polygon(${stage.topOff}% 0%, ${100 - stage.topOff}% 0%, ${100 - stage.botOff}% 100%, ${stage.botOff}% 100%)`,
                  }}
                />
                {/* Animated color fill */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: stage.gradient }}
                  initial={{
                    clipPath: `polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)`,
                  }}
                  animate={isInView ? {
                    clipPath: `polygon(${stage.topOff}% 0%, ${100 - stage.topOff}% 0%, ${100 - stage.botOff}% 100%, ${stage.botOff}% 100%)`,
                  } : {}}
                  transition={{ duration: 0.9, delay: 0.35 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Shine */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-transparent pointer-events-none"
                  style={{
                    clipPath: `polygon(${stage.topOff}% 0%, ${100 - stage.topOff}% 0%, ${100 - stage.botOff}% 100%, ${stage.botOff}% 100%)`,
                  }}
                />
                {/* Label centered inside bar */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/80 text-xs font-semibold tracking-wide drop-shadow hidden sm:block">
                    {stage.label}
                  </span>
                </div>
              </div>

              {/* Right — value + percentage */}
              <div className="pl-4">
                <p className="text-xl md:text-2xl font-black text-white leading-none">
                  <AnimatedCounter end={stage.value} />
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stage.pct}%</p>
              </div>
            </motion.div>
          ))}

          {/* Funnel spout */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.2 }}
              style={{ originY: 0, width: `${100 - 2 * 43}%` }}
              className="h-6 bg-gradient-to-b from-rose-600 to-pink-900 rounded-b-xl"
            />
          </div>
        </div>

        {/* Result card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
