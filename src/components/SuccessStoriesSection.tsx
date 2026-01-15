import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Building2, Code, Factory, Stethoscope } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface SuccessStory {
  industry: string;
  icon: typeof Building2;
  period: string;
  metrics: Metric[];
  description: string;
  highlight?: boolean;
}

const successStories: SuccessStory[] = [
  {
    industry: "Centro Médico Especializado",
    icon: Stethoscope,
    period: "12 meses",
    highlight: true,
    metrics: [
      { value: 1882, label: "Leads Totales" },
      { value: 40.5, suffix: "%", label: "Ahorro en Pauta" },
      { value: 5.11, suffix: "%", label: "CTR (vs 1.69%)" },
    ],
    description:
      "Transformamos su estrategia de volumen a rentabilidad. 112 citas agendadas confirmadas con un costo por conversión optimizado de $9,807.",
  },
  {
    industry: "Consultoría B2B",
    icon: Building2,
    period: "4 meses",
    metrics: [
      { value: 340, prefix: "+", suffix: "%", label: "Leads Cualificados" },
      { value: 45, suffix: "%", label: "Tasa de Conversión" },
      { value: 180, prefix: "$", suffix: "K", label: "Generados" },
    ],
    description:
      "De campañas sin seguimiento a un embudo automatizado que cierra prospectos mientras el equipo duerme.",
  },
  {
    industry: "Software SaaS",
    icon: Code,
    period: "6 meses",
    metrics: [
      { value: 520, prefix: "+", suffix: "%", label: "Tráfico Orgánico" },
      { value: 28, label: "Leads/Semana" },
      { value: 15, prefix: "$", suffix: "K MRR", label: "Adicional" },
    ],
    description:
      "SEO estratégico combinado con automatización que genera demos cualificadas 24/7 sin intervención manual.",
  },
  {
    industry: "Servicios Industriales",
    icon: Factory,
    period: "3 meses",
    metrics: [
      { value: 12, suffix: "x", label: "Retorno en Pauta" },
      { value: 67, suffix: "%", label: "Reducción Costo/Lead" },
      { value: 95, prefix: "$", suffix: "K", label: "En Ventas" },
    ],
    description:
      "Optimización de campañas publicitarias con seguimiento inteligente que convierte clics en contratos.",
  },
];

const SuccessStoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Resultados que{" "}
            <span className="text-gradient-warm">Hablan por Sí Solos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Casos reales de empresas que transformaron su proceso comercial
            y multiplicaron sus resultados.
          </p>
        </motion.div>

        <div className="space-y-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.industry}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, rotateY: index % 2 === 0 ? -10 : 10 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.15 * (index + 1),
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.3 }
              }}
              className={`card-dashboard p-6 lg:p-8 cursor-pointer ${
                story.highlight 
                  ? 'ring-2 ring-warm/30 bg-gradient-to-r from-card via-warm/5 to-accent/30' 
                  : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Header with industry and period */}
                <div className="flex items-center justify-between lg:justify-start lg:flex-col lg:items-start lg:min-w-[200px] gap-2">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        story.highlight 
                          ? 'bg-gradient-to-br from-warm to-warm/80' 
                          : 'bg-warm/10'
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <story.icon size={20} className={story.highlight ? 'text-white' : 'text-warm'} />
                    </motion.div>
                    <span className="font-semibold text-foreground">
                      {story.industry}
                    </span>
                  </div>
                  <motion.span 
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      story.highlight 
                        ? 'bg-warm text-white' 
                        : 'bg-accent text-accent-foreground'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {story.period}
                  </motion.span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 lg:gap-8 flex-1">
                  {story.metrics.map((metric, metricIndex) => (
                    <motion.div 
                      key={metric.label} 
                      className="text-center lg:text-left"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.15 + metricIndex * 0.1 }}
                    >
                      <div className="flex items-center justify-center lg:justify-start gap-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={isInView ? { scale: 1 } : {}}
                          transition={{ delay: 0.5 + index * 0.15 + metricIndex * 0.1, type: "spring" }}
                        >
                          <TrendingUp
                            size={16}
                            className="text-success hidden sm:block"
                          />
                        </motion.div>
                        <p className={`text-2xl lg:text-3xl font-bold ${
                          story.highlight ? 'text-gradient-warm' : 'text-gradient-warm'
                        }`}>
                          <AnimatedCounter 
                            end={metric.value} 
                            prefix={metric.prefix}
                            suffix={metric.suffix}
                            decimals={metric.value % 1 !== 0 ? 1 : 0}
                          />
                        </p>
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                        {metric.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div className="lg:max-w-xs">
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{story.description}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
