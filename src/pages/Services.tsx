import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  Search,
  Target,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Bot,
  Palette,
  Mail,
  Zap,
  TrendingUp,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const packages = [
  {
    icon: Zap,
    title: "Sistema Base",
    subtitle: "Deja de perder leads",
    description:
      "Para empresas que ya reciben contactos pero los están perdiendo por falta de seguimiento.",
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
    title: "Sistema de Crecimiento",
    subtitle: "Más leads, mejor calidad",
    description:
      "Para empresas que quieren escalar la captación con publicidad y automatizar todo el proceso de conversión.",
    features: [
      "Todo lo del Sistema Base",
      "Campañas en Google Ads y Meta Ads",
      "Páginas de captura optimizadas",
      "Nutrición automática multicanal",
      "Cualificación y scoring inteligente de leads",
      "Reportes de ROI por canal",
    ],
    promise: "Leads cualificados, no solo contactos. Tu cierre mejora desde el primer mes.",
    highlight: true,
    badge: "Más popular",
  },
  {
    icon: Rocket,
    title: "Sistema 360°",
    subtitle: "Escala sin contratar más",
    description:
      "El sistema completo de revenue. Desde atraer al desconocido hasta cerrar y retener al cliente.",
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

const services = [
  {
    icon: Globe,
    title: "Diseño Web",
    subtitle: "Tu mejor vendedor, 24/7",
    description:
      "Creamos páginas web que no solo se ven bien, sino que convierten. Cada elemento está pensado para que tus visitantes den el siguiente paso y se conviertan en clientes.",
    features: [
      "Diseño responsive y moderno",
      "Optimización de velocidad de carga",
      "SEO técnico incluido",
      "Integración con analytics y tracking",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Tiendas Online",
    subtitle: "Vende mientras duermes",
    description:
      "Montamos tu ecommerce con la plataforma ideal para tu negocio: catálogo, pagos, envíos y todo lo que necesitas para vender online sin complicaciones técnicas.",
    features: [
      "Configuración completa de tu tienda",
      "Pasarelas de pago integradas",
      "Gestión de inventario y envíos",
      "Diseño optimizado para conversión",
    ],
  },
  {
    icon: Search,
    title: "SEO",
    subtitle: "Que te encuentren quienes te buscan",
    description:
      "Posicionamiento orgánico en Google para que aparezcas cuando tus clientes potenciales buscan lo que ofreces. Resultados sostenibles que crecen con el tiempo.",
    features: [
      "Auditoría técnica completa",
      "Optimización on-page y off-page",
      "Estrategia de contenido",
      "Reportes mensuales de posición",
    ],
  },
  {
    icon: Target,
    title: "Publicidad Digital",
    subtitle: "Inversión inteligente, resultados reales",
    description:
      "Campañas en Google y Meta Ads diseñadas para captar leads cualificados. Maximizamos cada peso que inviertes en publicidad.",
    features: [
      "Google Ads: Búsqueda y Display",
      "Meta Ads: Facebook e Instagram",
      "Remarketing y audiencias personalizadas",
      "Optimización continua de campañas",
    ],
  },
  {
    icon: Palette,
    title: "Diseño Gráfico",
    subtitle: "Tu marca, memorable",
    description:
      "Creamos la identidad visual que tu marca necesita para destacar. Desde logos hasta material para redes, todo pensado para que te recuerden.",
    features: [
      "Diseño de logos e identidad visual",
      "Material para redes sociales",
      "Presentaciones corporativas",
      "Diseño de material impreso",
    ],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    subtitle: "Conecta con quienes ya te conocen",
    description:
      "Secuencias de email que nutren a tus leads y mantienen a tus clientes cerca. Automatizaciones que trabajan mientras tú te enfocas en cerrar ventas.",
    features: [
      "Estrategia de secuencias personalizada",
      "Diseño de emails atractivos",
      "Automatizaciones y flujos de nutrición",
      "Segmentación avanzada de contactos",
    ],
  },
  {
    icon: Bot,
    title: "Automatización con IA",
    subtitle: "Tu equipo de ventas nunca duerme",
    description:
      "Implementamos agentes conversacionales con inteligencia artificial que responden, cualifican y agendan automáticamente. Tu equipo solo interviene para cerrar.",
    features: [
      "Agente conversacional activo 24/7",
      "Cualificación automática de leads",
      "Respuestas personalizadas por contexto",
      "Integración directa con tu CRM",
    ],
    highlight: true,
  },
];

const Services = () => {
  const heroRef = useRef(null);
  const packagesRef = useRef(null);
  const servicesRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const packagesInView = useInView(packagesRef, { once: true, margin: "-80px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 gradient-mesh-warm">
        <div className="section-container">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Nuestros Servicios
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Del primer clic{" "}
              <span className="text-primary">al cliente cerrado</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Construimos el sistema completo: captamos el lead, lo nutrimos,
              lo cualificamos y lo entregamos a tu equipo cuando ya está listo
              para comprar. Todo automatizado.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Cuéntanos qué necesitas
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section ref={packagesRef} className="py-20 md:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={packagesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Elige tu nivel de crecimiento
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada sistema está diseñado para un momento diferente de tu negocio.
              Todos incluyen implementación, soporte y optimización continua.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, y: 30 }}
                animate={packagesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className={`card-dashboard p-8 relative flex flex-col ${
                  pkg.highlight ? "ring-2 ring-primary/40 bg-primary/5 scale-[1.02]" : ""
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow">
                    {pkg.badge}
                  </span>
                )}

                <div className="mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      pkg.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <pkg.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{pkg.title}</h3>
                  <p className="text-sm font-semibold text-primary">{pkg.subtitle}</p>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-primary text-center">
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
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿No sabes cuál es el tuyo?{" "}
            <a href="/contacto" className="text-primary font-medium hover:underline">
              Hablamos y te lo decimos sin compromiso.
            </a>
          </p>
        </div>
      </section>

      {/* Individual services detail */}
      <section ref={servicesRef} className="py-20 md:py-28 bg-secondary/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              ¿Qué hay dentro de cada sistema?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada servicio forma parte de una estrategia mayor. Aquí está
              el detalle de lo que construimos para ti.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * (index + 1) }}
                className={`card-dashboard p-8 relative ${
                  service.highlight ? "ring-2 ring-primary/30 bg-primary/5" : ""
                }`}
              >
                {service.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Lo que nos diferencia
                  </span>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                      service.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <service.icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-primary">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground font-medium text-sm">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="sm" asChild>
                  <a href="/contacto">
                    Más información
                    <ArrowRight size={14} />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              ¿No sabes por dónde{" "}
              <span className="text-muted-foreground">empezar</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Es normal. Cada negocio es diferente. Cuéntanos sobre el tuyo y
              te diremos honestamente qué necesitas (y qué no).
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Agenda una llamada sin compromiso
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Services;
