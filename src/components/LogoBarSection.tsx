import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import falconCloud from "@/assets/clients/falcon-cloud.png";
import ecosfera from "@/assets/clients/ecosfera.png";
import componenteLegal from "@/assets/clients/componente-legal.png";
import torregroza from "@/assets/clients/torregroza-diazgranados.png";
import aeroAmbulancias from "@/assets/clients/aero-ambulancias.jpg";
import findolor from "@/assets/clients/findolor.png";

const logos = [
  { src: falconCloud, alt: "Falcon Cloud" },
  { src: ecosfera, alt: "Ecosfera" },
  { src: componenteLegal, alt: "Componente Legal" },
  { src: torregroza, alt: "Torregroza & Diazgranados" },
  { src: aeroAmbulancias, alt: "Aero Ambulancias" },
  { src: findolor, alt: "FinDolor" },
];

const LogoBarSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <section ref={ref} className="py-10 border-y border-border bg-secondary/40">
      <div className="section-container">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest"
        >
          Empresas que ya tienen su sistema activo
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoBarSection;
