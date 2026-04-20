import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Code, Factory, Stethoscope, ArrowRight, TrendingUp } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const aggregateStats = [
  { value: 85.6, suffix: "K", label: "Impresiones orgánicas/mes" },
  { value: 342, label: "Keywords en top 3" },
  { value: 1882, label: "Leads generados" },
  { value: 40, suffix: "%", label: "Reducción coste por lead" },
];

interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface SuccessStory {
  industry: string;
  sector: string;
  icon: typeof Building2;
  period: string;
  metrics: Metric[];
  description: string;
  highlight?: boolean;
  color: string;
  iconBg: string;
  iconColor: string;
  badge: string;
}

const successStories: SuccessStory[] = [
  {
    industry: "Centro Médico Especializado",
    sector: "Salud",
    icon: Stethoscope,
    period: "12 meses",
    highlight: true,
    color: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    badge: "bg-emerald-100 text-emerald-700",
    metrics: [
      { value: 1882, label: "Leads Totales" },
      { value: 40.5, suffix: "%", label: "Ahorro en Pauta" },
      { value: 5.11, suffix: "%", label: "CTR (vs 1.69%)" },
    ],
    description:
      "Pasamos de perseguir volumen a buscar calidad. El resultado: pacientes reales que querían tratarse, no solo preguntar precios.",
  },
  {
    industry: "Consultoría B2B",
    sector: "B2B / Servicios",
    icon: Building2,
    period: "4 meses",
    color: "from-primary/10 to-primary/5",
    iconBg: "bg-primary",
    iconColor: "text-white",
    badge: "bg-blue-100 text-blue-700",
    metrics: [
      { value: 340, prefix: "+", suffix: "%", label: "Leads Cualificados" },
      { value: 45, suffix: "%", label: "Tasa de Conversión" },
      { value: 180, prefix: "$", suffix: "K", label: "Generados" },
    ],
    description:
      "Antes los leads se enfriaban. Ahora el sistema los nutre automáticamente y el equipo solo habla con quienes están listos para comprar.",
  },
  {
    industry: "Empresa de Servicios",
    sector: "SEO Orgánico",
    icon: Code,
    period: "7 meses",
    color: "from-purple-500/10 to-purple-600/5",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
    badge: "bg-violet-100 text-violet-700",
    metrics: [
      { value: 342, label: "Keywords Top 3" },
      { value: 85.6, suffix: "K", label: "Impresiones/mes" },
      { value: 1.97, suffix: "K", label: "Visitas Orgánicas" },
    ],
    description:
      "Partían de cero visibilidad en Google. En 7 meses, 342 palabras clave en top 3 y tráfico orgánico sostenible que llega solo, sin pagar por cada clic.",
  },
  {
    industry: "Servicios Industriales",
    sector: "Industrial",
    icon: Factory,
    period: "3 meses",
    color: "from-orange-500/10 to-orange-600/5",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    badge: "bg-orange-100 text-orange-700",
    metrics: [
      { value: 12, suffix: "x", label: "Retorno en Pauta" },
      { value: 67, suffix: "%", label: "Reducción Costo/Lead" },
      { value: 95, prefix: "$", suffix: "K", label: "En Ventas" },
    ],
    description:
      "Gastaban mucho y cerraban poco. Ajustamos las campañas, pusimos seguimiento real y triplicaron sus cierres en 3 meses.",
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            Empresas como la tuya{" "}
            <span className="text-muted-foreground">ya lo consiguieron</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Números reales, empresas reales. Sin filtros.
          </p>
        </motion.div>

        {/* Aggregate stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 rounded-2xl bg-primary/5 border border-primary/10"
        >
          {aggregateStats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-black text-primary">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.industry}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1), ease: "easeOut" }}
              className={`card-dashboard p-6 bg-gradient-to-br ${story.color}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${story.iconBg}`}>
                    <story.icon size={22} className={story.iconColor} />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-sm">
                      {story.industry}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${story.badge}`}>
                      {story.sector}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground border border-border rounded-full px-3 py-1">
                  {story.period}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {story.metrics.map((metric) => (
                  <div key={metric.label} className="text-center p-3 rounded-xl bg-background/70 backdrop-blur-sm">
                    <p className="text-xl font-bold text-primary">
                      <AnimatedCounter
                        end={metric.value}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        decimals={metric.value % 1 !== 0 ? 1 : 0}
                      />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/30 pl-3">
                "{story.description}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA after stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">
            ¿Tu sector no aparece? Hemos trabajado con más de 8 industrias.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm group"
          >
            Cuéntanos sobre tu negocio
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
