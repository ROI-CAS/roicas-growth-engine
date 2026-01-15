import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, BarChart3, Target, Megaphone, Smartphone, Database } from "lucide-react";

const technologies = [
  {
    name: "Diseño Web",
    description: "Sitios optimizados para conversión",
    icon: Globe,
  },
  {
    name: "SEO Avanzado",
    description: "Posicionamiento orgánico estratégico",
    icon: BarChart3,
  },
  {
    name: "Publicidad Digital",
    description: "Google, Meta y TikTok Ads",
    icon: Target,
  },
  {
    name: "Email Marketing",
    description: "Campañas que convierten",
    icon: Megaphone,
  },
  {
    name: "CRM & Automatización",
    description: "Seguimiento inteligente de leads",
    icon: Database,
  },
];

const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px"
  });

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nuestro <span className="text-gradient-warm">Stack</span> de Crecimiento
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Herramientas y estrategias probadas para escalar tu negocio B2B.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="card-dashboard p-4 md:p-6 text-center group cursor-pointer"
            >
              <motion.div 
                className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-warm/10 to-accent flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <tech.icon className="w-6 h-6 text-warm" />
              </motion.div>
              <h3 className="font-semibold text-sm md:text-base mb-1">{tech.name}</h3>
              <p className="text-xs text-muted-foreground hidden md:block">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
