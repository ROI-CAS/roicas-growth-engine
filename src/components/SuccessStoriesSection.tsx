import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Building2, Code, Factory } from "lucide-react";

const successStories = [
  {
    industry: "Consultoría B2B",
    icon: Building2,
    period: "4 meses",
    metrics: [
      { value: "+340%", label: "Leads Cualificados" },
      { value: "45%", label: "Tasa de Conversión" },
      { value: "$180K", label: "Generados" },
    ],
    description:
      "De campañas sin seguimiento a un embudo automatizado que cierra prospectos mientras el equipo duerme.",
  },
  {
    industry: "Software SaaS",
    icon: Code,
    period: "6 meses",
    metrics: [
      { value: "+520%", label: "Tráfico Orgánico" },
      { value: "28", label: "Leads/Semana" },
      { value: "$15K", label: "MRR Adicional" },
    ],
    description:
      "SEO estratégico combinado con automatización que genera demos cualificadas 24/7 sin intervención manual.",
  },
  {
    industry: "Servicios Industriales",
    icon: Factory,
    period: "3 meses",
    metrics: [
      { value: "12x", label: "Retorno en Pauta" },
      { value: "67%", label: "Reducción Costo/Lead" },
      { value: "$95K", label: "En Ventas" },
    ],
    description:
      "Optimización de campañas publicitarias con seguimiento inteligente que convierte clics en contratos.",
  },
];

const SuccessStoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-secondary">
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
            <span className="text-gradient">Hablan por Sí Solos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Casos reales de empresas B2B que transformaron su proceso comercial
            y multiplicaron sus resultados.
          </p>
        </motion.div>

        <div className="space-y-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.industry}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="card-dashboard p-6 lg:p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Header with industry and period */}
                <div className="flex items-center justify-between lg:justify-start lg:flex-col lg:items-start lg:min-w-[180px] gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <story.icon size={20} className="text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">
                      {story.industry}
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                    {story.period}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 lg:gap-8 flex-1">
                  {story.metrics.map((metric) => (
                    <div key={metric.label} className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-1">
                        <TrendingUp
                          size={16}
                          className="text-success hidden sm:block"
                        />
                        <p className="text-2xl lg:text-3xl font-bold text-gradient">
                          {metric.value}
                        </p>
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="lg:max-w-xs">
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
