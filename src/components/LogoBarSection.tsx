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

// Tripled so the infinite loop never shows a gap at any viewport width
const track = [...logos, ...logos, ...logos];

const LogoBarSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <section ref={ref} className="py-10 border-y border-border bg-secondary/40 overflow-hidden">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center text-sm text-muted-foreground mb-8"
      >
        Empresas que confían en nuestro sistema para crecer
      </motion.p>

      {/* Marquee wrapper — fade edges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {track.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className="flex items-center justify-center px-10 group cursor-default"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default LogoBarSection;
