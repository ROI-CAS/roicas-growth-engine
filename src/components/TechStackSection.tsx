import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const technologies = [
  { name: "GoHighLevel", abbr: "GHL" },
  { name: "N8N", abbr: "N8N" },
  { name: "Ubersuggest", abbr: "UB" },
  { name: "Hostinger", abbr: "HO" },
  { name: "Google Ads", abbr: "GA" },
];

const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-16 bg-secondary">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            Potenciado por tecnología de élite para resultados predecibles
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="group cursor-pointer"
              >
                <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-background border border-border transition-all duration-300 group-hover:border-primary group-hover:shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {tech.abbr.slice(0, 2)}
                  </div>
                  <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
