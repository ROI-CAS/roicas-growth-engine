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
    value: 4827, 
    percentage: 100,
    color: "from-primary to-primary/80"
  },
  { 
    icon: Target, 
    label: "Leads Cualificados", 
    value: 1014, 
    percentage: 21,
    color: "from-emerald-500 to-emerald-600"
  },
  { 
    icon: Calendar, 
    label: "Citas Agendadas", 
    value: 289, 
    percentage: 6,
    color: "from-amber-500 to-amber-600"
  },
  { 
    icon: Handshake, 
    label: "Clientes Cerrados", 
    value: 87, 
    percentage: 1.8,
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
            Así convertimos <span className="text-gradient">visitas en clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No importa de dónde lleguen tus leads. Nuestro sistema los captura, 
            los cualifica y los acompaña hasta que estén listos para hablar contigo.
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
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-6 h-6 rounded-full ${source.color} flex items-center justify-center`}>
                  <source.icon size={12} className="text-white" />
                </div>
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
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <div 
                  className={`
                    mx-auto bg-gradient-to-r ${stage.color} rounded-xl p-4 md:p-6
                    flex items-center justify-between text-white shadow-lg hover:shadow-xl transition-shadow
                  `}
                  style={{ 
                    width: `${100 - index * 15}%`,
                    maxWidth: '100%'
                  }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <stage.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-medium opacity-90">{stage.label}</p>
                      <p className="text-2xl md:text-3xl font-bold">
                        <AnimatedCounter end={stage.value} />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-bold">
                      {stage.percentage}%
                    </p>
                    <p className="text-xs md:text-sm opacity-75">del total</p>
                  </div>
                </div>
                
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
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 card-dashboard p-6 md:p-8 max-w-2xl mx-auto"
          >
            <p className="text-muted-foreground mb-4 text-center">Resultados del Embudo</p>
            
            {/* Main Result */}
            <div className="text-center mb-6">
              <p className="text-4xl md:text-5xl font-bold text-gradient-warm mb-2">
                $<AnimatedCounter end={174} />K+
              </p>
              <p className="text-lg text-foreground font-medium">
                En ventas cerradas con un ROI de{" "}
                <span className="text-success font-bold">
                  <AnimatedCounter end={9} />x
                </span>
              </p>
            </div>

            {/* CPL & CPA Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CPL</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                $<AnimatedCounter end={4.12} decimals={2} />
              </p>
                <p className="text-xs text-muted-foreground">Costo por Lead</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CPA</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  $<AnimatedCounter end={221} />
                </p>
                <p className="text-xs text-muted-foreground">Costo por Adquisición</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
