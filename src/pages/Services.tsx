import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  Search,
  Target,
  Users,
  Video,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Globe,
    title: "Diseño Web",
    description:
      "Páginas web profesionales, rápidas y optimizadas para convertir visitantes en clientes. Diseño moderno que refleja la esencia de tu marca.",
    features: [
      "Diseño responsive y moderno",
      "Optimización de velocidad de carga",
      "SEO técnico incluido",
      "Integración con analytics y tracking",
    ],
  },
  {
    icon: Search,
    title: "SEO",
    description:
      "Posicionamiento orgánico en Google para que te encuentren quienes realmente buscan lo que ofreces. Resultados sostenibles a largo plazo.",
    features: [
      "Auditoría técnica completa",
      "Optimización on-page y off-page",
      "Estrategia de contenido",
      "Reportes mensuales de posición",
    ],
  },
  {
    icon: Target,
    title: "Google Ads",
    description:
      "Campañas de búsqueda y display para captar leads cualificados con intención de compra. Máximo retorno de inversión publicitaria.",
    features: [
      "Investigación de palabras clave",
      "Creación y optimización de anuncios",
      "Remarketing y audiencias personalizadas",
      "Optimización de conversiones",
    ],
  },
  {
    icon: Users,
    title: "Meta Ads",
    description:
      "Publicidad en Facebook e Instagram para alcanzar a tu audiencia ideal con precisión quirúrgica. Escalamos lo que funciona.",
    features: [
      "Segmentación avanzada de audiencias",
      "Creatividades optimizadas para conversión",
      "Campañas de leads y ventas",
      "A/B testing continuo",
    ],
  },
  {
    icon: Video,
    title: "TikTok Ads",
    description:
      "Campañas en TikTok para conectar con nuevas audiencias mediante contenido dinámico y auténtico. La plataforma de mayor crecimiento.",
    features: [
      "Estrategia de contenido nativo",
      "Campañas de awareness y conversión",
      "Colaboración con creadores",
      "Análisis de tendencias del mercado",
    ],
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
      <section className="pt-32 pb-20 gradient-mesh">
        <div className="section-container">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Soluciones Digitales que{" "}
              <span className="text-gradient">Impulsan tu Crecimiento</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Desde el diseño de tu web hasta campañas publicitarias de alto
              rendimiento. Todo lo que necesitas para dominar el mercado digital
              B2B.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="#contacto" className="group">
                Solicitar Consultoría Gratuita
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
          <div className="space-y-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="card-dashboard p-8 lg:p-10"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  {/* Left: Title and Description */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <service.icon size={28} className="text-primary" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Right: Features */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      ¿Qué incluye?
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <CheckCircle2
                            size={20}
                            className="text-success shrink-0 mt-0.5"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4">
                      <Button variant="outline" asChild>
                        <a href="/#contacto">
                          Solicitar información
                          <ArrowRight size={16} />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para{" "}
              <span className="text-gradient">Impulsar tu Negocio</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Agenda una consultoría gratuita y descubre cómo podemos ayudarte a
              alcanzar tus objetivos de crecimiento.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/#contacto" className="group">
                Agendar Consultoría Gratuita
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
