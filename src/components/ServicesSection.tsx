import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Target, Cog, ShoppingCart, Bot, Palette } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Tu web, tu mejor vendedor",
    description:
      "Creamos sitios que no solo se ven bien, sino que convierten. Webs rápidas, claras y pensadas para que tus visitantes se conviertan en clientes.",
    highlight: false,
  },
  {
    icon: ShoppingCart,
    title: "Tiendas online que venden solas",
    description:
      "Montamos tu ecommerce con WooCommerce: catálogo, pagos, envíos y todo lo que necesitas para vender online sin complicaciones técnicas.",
    highlight: false,
  },
  {
    icon: Target,
    title: "Te ponemos delante de quien te busca",
    description:
      "SEO y campañas en Google, Meta y TikTok diseñadas para atraer a personas que ya están buscando lo que ofreces. Nada de clics vacíos.",
    highlight: false,
  },
  {
    icon: Palette,
    title: "Diseño gráfico que comunica",
    description:
      "Creamos la identidad visual de tu marca: logos, presentaciones, material para redes y todo lo que necesitas para destacar y ser recordado.",
    highlight: false,
  },
  {
    icon: Bot,
    title: "IA que trabaja por ti 24/7",
    description:
      "Automatizamos tareas repetitivas con inteligencia artificial: chatbots, respuestas automáticas, clasificación de leads y más.",
    highlight: true,
    badge: "Lo que nos diferencia",
  },
  {
    icon: Cog,
    title: "Ningún lead se queda sin respuesta",
    description:
      "Automatizamos el seguimiento para que cada contacto reciba atención personalizada. Tú te enfocas en cerrar, nosotros en que nadie se pierda.",
    highlight: false,
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            Todo lo que necesitas{" "}
            <span className="text-muted-foreground">en un solo lugar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No necesitas 5 proveedores diferentes. Nosotros nos encargamos 
            de todo el proceso para que tú hagas lo que mejor sabes: dirigir tu negocio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
