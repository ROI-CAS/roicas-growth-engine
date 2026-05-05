import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Zap, TrendingUp, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    icon: Zap,
    bg: "bg-amber-500",
    title: "Sistema Base",
    subtitle: "Deja de perder leads",
    description:
      "Para empresas que ya reciben contactos pero los están perdiendo por falta de seguimiento. Organizamos y automatizamos tu proceso de ventas desde el día 1.",
    features: [
      "CRM y pipeline de ventas visual",
      "Captura automática de contactos",
      "Secuencia de bienvenida en menos de 5 minutos",
      "Agendamiento automático de citas",
      "Notificación instantánea al comercial",
      "Reportes semanales de resultados",
    ],
    promise: "En 15 días tu equipo deja de perseguir leads.",
    highlight: false,
    badge: null,
  },
  {
    icon: TrendingUp,
    bg: "bg-brand",
    title: "Sistema de Crecimiento",
    subtitle: "Más leads, mejor calidad",
    description:
      "Para empresas que quieren escalar la captación con publicidad y automatizar todo el proceso de conversión. Generamos demanda y la convertimos en oportunidades reales.",
    features: [
      "Todo lo del Sistema Base",
      "Campañas en Google Ads y Meta Ads",
      "Páginas de captura optimizadas para conversión",
      "Nutrición automática multicanal",
      "Cualificación y scoring inteligente de leads",
      "Reportes de ROI por canal de captación",
    ],
    promise: "Leads cualificados, no solo contactos. Tu cierre mejora desde el primer mes.",
    highlight: true,
    badge: "Más popular",
  },
  {
    icon: Rocket,
    bg: "bg-zinc-600",
    title: "Sistema 360°",
    subtitle: "Escala sin contratar más",
    description:
      "El sistema completo de revenue. Desde atraer al desconocido hasta cerrar y retener al cliente. Tu equipo comercial recibe oportunidades, no tareas.",
    features: [
      "Todo lo del Sistema de Crecimiento",
      "SEO y posicionamiento orgánico sostenible",
      "Web o landing page de alta conversión",
      "Agente conversacional con IA activo 24/7",
      "Gestión de reputación y reseñas automáticas",
      "Reunión estratégica mensual de optimización",
    ],
    promise: "De desconocido a cliente cerrado. Completamente automatizado.",
    highlight: false,
    badge: null,
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicios" className="py-20 md:py-28">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Un sistema completo,{" "}
            <span className="text-gradient-warm">tres niveles de crecimiento</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No vendemos servicios sueltos. Construimos el sistema que lleva a tu cliente
            potencial desde el primer contacto hasta el cierre — y tu equipo solo aparece
            cuando el lead ya está listo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className={`card-dashboard p-8 relative flex flex-col ${
                pkg.highlight
                  ? "ring-2 ring-brand/40 bg-brand/5 -translate-y-1 shadow-lg"
                  : ""
              }`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand text-brand-foreground text-xs font-bold rounded-full shadow-sm">
                  {pkg.badge}
                </span>
              )}

              {/* Level + icon */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-xl ${pkg.bg} flex items-center justify-center shadow-md`}>
                    <pkg.icon size={26} className="text-white" strokeWidth={2} />
                  </div>
                  <span className="text-4xl font-black text-border select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{pkg.title}</h3>
                <p className="text-sm font-semibold text-brand">{pkg.subtitle}</p>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {pkg.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      size={16}
                      className="text-brand shrink-0 mt-0.5"
                    />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Promise */}
              <div className="mb-6 px-4 py-3 rounded-lg bg-brand/10 border border-brand/20">
                <p className="text-xs font-semibold text-brand text-center">
                  {pkg.promise}
                </p>
              </div>

              <Button
                variant={pkg.highlight ? "hero" : "outline"}
                size="default"
                className="w-full"
                asChild
              >
                <a href="/contacto" className="group">
                  Quiero este sistema
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          ¿No sabes cuál es el tuyo?{" "}
          <a href="/contacto" className="text-brand font-medium hover:underline">
            Hablamos y te lo decimos sin compromiso.
          </a>
        </motion.p>
      </div>
    </section>
  );
};

export default ServicesSection;
