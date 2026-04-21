import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Building2, Code, Factory, Stethoscope, ArrowRight, X, ZoomIn, Search, TrendingUp, Users, Percent } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import seoCase01 from "@/assets/results/seo-case-01.png";
import seoCase02 from "@/assets/results/seo-case-02.png";
import seoCase03 from "@/assets/results/seo-case-03.png";

const aggregateStats = [
  { value: 85.6, suffix: "K", label: "Impresiones orgánicas/mes", icon: TrendingUp, color: "from-blue-500 to-indigo-600", bg: "bg-blue-500" },
  { value: 342, label: "Keywords en top 3", icon: Search, color: "from-violet-500 to-purple-600", bg: "bg-violet-500" },
  { value: 1882, label: "Leads generados", icon: Users, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500" },
  { value: 40, suffix: "%", label: "Reducción coste por lead", icon: Percent, color: "from-amber-500 to-orange-500", bg: "bg-amber-500" },
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
  evidence?: { src: string; alt: string }[];
}

const seoEvidence = [
  { src: seoCase01, alt: "Métricas SEO: tráfico 1.97K e impresiones 85.64K" },
  { src: seoCase02, alt: "Posiciones de palabras clave: 342 en top 3" },
  { src: seoCase03, alt: "Evolución de palabras clave posicionadas" },
];

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
    icon: Search,
    period: "7 meses",
    color: "from-violet-500/10 to-violet-600/5",
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
    evidence: seoEvidence,
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

const Lightbox = ({ images, startIndex, onClose }: { images: { src: string; alt: string }[]; startIndex: number; onClose: () => void }) => {
  const [current, setCurrent] = useState(startIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={28} />
        </button>

        <img
          src={images[current].src}
          alt={images[current].alt}
          className="w-full h-auto rounded-xl shadow-2xl"
        />

        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`overflow-hidden rounded-lg border-2 transition-all ${i === current ? "border-white" : "border-transparent opacity-60 hover:opacity-90"}`}
            >
              <img src={img.src} alt={img.alt} className="w-20 h-14 object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SuccessStoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null);

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

        {/* Elegant aggregate stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {aggregateStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card-dashboard p-5 flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Color accent top line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color}`} />

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                <stat.icon size={18} className="text-white" />
              </div>

              <div>
                <p className="text-3xl font-black text-primary leading-none">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                  />
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.industry}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1), ease: "easeOut" }}
              className={`card-dashboard p-6 bg-gradient-to-br ${story.color} flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${story.iconBg} shadow-sm`}>
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
              <p className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/30 pl-3 mb-4">
                "{story.description}"
              </p>

              {/* Evidence screenshots — only for stories with proof images */}
              {story.evidence && (
                <div className="mt-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ZoomIn size={11} />
                    Datos verificados — clic para ampliar
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {story.evidence.map((img, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setLightbox({ images: story.evidence!, index: i })}
                        className="relative overflow-hidden rounded-lg border border-border/60 shadow-sm group"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-20 object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ZoomIn size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
};

export default SuccessStoriesSection;
