import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  Search,
  Target,
  Video,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Bot,
  Palette,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      "Montamos tu ecommerce con WooCommerce: catálogo, pagos, envíos y todo lo que necesitas para vender online sin complicaciones técnicas. Tú te enfocas en el producto, nosotros en la plataforma.",
    features: [
      "Configuración completa de WooCommerce",
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
      "Campañas en Google, Facebook, Instagram y TikTok diseñadas para captar leads cualificados. Maximizamos cada peso que inviertes en publicidad.",
    features: [
      "Google Ads: Búsqueda y Display",
      "Meta Ads: Facebook e Instagram",
      "TikTok Ads para nuevas audiencias",
      "Remarketing y audiencias personalizadas",
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
      "Campañas de email que nutren a tus leads y mantienen a tus clientes cerca. Automatizaciones que trabajan mientras tú te enfocas en cerrar ventas.",
    features: [
      "Estrategia de email personalizada",
      "Diseño de newsletters atractivas",
      "Automatizaciones y secuencias",
      "Segmentación avanzada de listas",
    ],
  },
  {
    icon: Bot,
    title: "Automatización con IA",
    subtitle: "Tecnología que trabaja por ti",
    description:
      "Implementamos inteligencia artificial para automatizar tareas repetitivas: chatbots, clasificación de leads, respuestas automáticas y más. Tu equipo se enfoca en lo importante.",
    features: [
      "Chatbots inteligentes 24/7",
      "Clasificación automática de leads",
      "Respuestas automáticas personalizadas",
      "Integración con tu CRM",
    ],
    highlight: true,
  },
];

const Services = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-primary">
              Todo lo que necesitas para{" "}
              <span className="text-muted-foreground">crecer online</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              No necesitas 5 proveedores diferentes. Somos tu equipo de marketing digital 
              completo: desde la web hasta las automatizaciones que cierran ventas por ti.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Cuéntanos qué necesitas
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section ref={servicesRef} className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
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
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-success shrink-0 mt-0.5"
                      />
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

      {/* CTA Section */}
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
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
