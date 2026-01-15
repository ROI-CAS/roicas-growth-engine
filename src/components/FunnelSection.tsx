import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Search, 
  Mail, 
  Phone,
  Users,
  Target,
  Calendar,
  Handshake,
  ArrowDown
} from "lucide-react";
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
    value: 1882, 
    percentage: 100,
    color: "from-primary to-primary/80"
  },
  { 
    icon: Target, 
    label: "Leads Cualificados", 
    value: 394, 
    percentage: 21,
    color: "from-emerald-500 to-emerald-600"
  },
  { 
    icon: Calendar, 
    label: "Citas Agendadas", 
    value: 112, 
    percentage: 6,
    color: "from-amber-500 to-amber-600"
  },
  { 
    icon: Handshake, 
    label: "Clientes Cerrados", 
    value: 58, 
    percentage: 3,
    color: "from-rose-500 to-rose-600"
  },
];

const FunnelSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-secondary overflow-hidden">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            El <span className="text-gradient">Embudo</span> que Convierte
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Centralizamos todos tus canales en un sistema que no deja escapar ningún lead.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Sources Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {sources.map((source, index) => (
              <motion.div
                key={source.label}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2 + index * 0.08,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm cursor-pointer"
              >
                <motion.div 
                  className={`w-6 h-6 rounded-full ${source.color} flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <source.icon size={12} className="text-white" />
                </motion.div>
                <span className="text-sm font-medium">{source.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Arrows flowing down */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowDown className="w-5 h-5 text-warm" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Funnel Visualization */}
          <div className="space-y-4">
            {funnelStages.map((stage, index) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -100 : 100 }}
                animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.7 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative"
              >
                <motion.div 
                  className={`
                    mx-auto bg-gradient-to-r ${stage.color} rounded-xl p-4 md:p-6
                    flex items-center justify-between text-white shadow-lg
                  `}
                  style={{ 
                    width: `${100 - index * 15}%`,
                    maxWidth: '100%'
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stage.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </motion.div>
                    <div>
                      <p className="text-sm md:text-base font-medium opacity-90">{stage.label}</p>
                      <p className="text-2xl md:text-3xl font-bold">
                        <AnimatedCounter end={stage.value} />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-bold">
                      <AnimatedCounter end={stage.percentage} suffix="%" />
                    </p>
                    <p className="text-xs md:text-sm opacity-75">del total</p>
                  </div>
                </motion.div>
                
                {/* Connector */}
                {index < funnelStages.length - 1 && (
                  <motion.div 
                    className="flex justify-center py-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1 + index * 0.15 }}
                  >
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowDown className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
            className="mt-12 card-dashboard p-6 md:p-8 text-center max-w-xl mx-auto relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-warm/5 via-transparent to-warm/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-muted-foreground mb-2 relative z-10">Resultado Final</p>
            <p className="text-4xl md:text-5xl font-bold text-gradient-warm mb-2 relative z-10">
              $<AnimatedCounter end={95} />K+
            </p>
            <p className="text-lg text-foreground font-medium relative z-10">
              En ventas cerradas con un ROI de{" "}
              <span className="text-success font-bold">
                <AnimatedCounter end={12} />x
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
