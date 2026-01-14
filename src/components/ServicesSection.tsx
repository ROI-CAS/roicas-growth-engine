import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Target, Cog } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Diseño Web",
    description:
      "Páginas web profesionales, rápidas y optimizadas para convertir visitantes en clientes. Diseño moderno que refleja tu marca y genera confianza.",
    highlight: false,
  },
  {
    icon: Target,
    title: "SEO + Campañas",
    description:
      "Posicionamiento en Google y campañas de alto rendimiento en Google Ads, Meta y TikTok para captar leads cualificados con intención de compra.",
    highlight: false,
  },
  {
    icon: Cog,
    title: "Seguimiento y Automatización",
    description:
      "Sistemas inteligentes que nutren a cada prospecto automáticamente hasta que está listo para cerrar contigo. Ningún lead queda olvidado.",
    highlight: true,
    badge: "El Cerebro",
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
            Tu Aliado de Crecimiento:{" "}
            <span className="text-gradient">Del Lead al Cierre</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un sistema completo que trabaja mientras tú te enfocas en lo que
            mejor sabes hacer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className={`card-dashboard p-8 relative ${
                service.highlight
                  ? "border-primary/30 bg-primary/5"
                  : ""
              }`}
            >
              {service.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {service.badge}
                </span>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.highlight
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                <service.icon size={28} />
              </div>

              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
