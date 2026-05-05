import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nosotros" className="py-20 md:py-28 bg-secondary">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Sabemos lo que sientes cuando{" "}
            <span className="text-gradient-warm">inviertes sin ver resultados</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Has trabajado con agencias que te prometieron el mundo y solo te entregaron 
            informes bonitos. Entendemos esa frustración porque hemos ayudado a decenas 
            de empresas a salir de ahí. Tu negocio merece algo mejor.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-dashboard p-8 border-destructive/20 bg-destructive/5"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 mx-auto">
                <X size={24} className="text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lo que probablemente has vivido</h3>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>"Tienes muchas impresiones"... pero ningún cliente nuevo</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Leads que llegan y nadie les da seguimiento</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Firmaste y casi no volviste a hablar con ellos</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Pagas cada mes pero no ves el retorno</span>
                </li>
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-dashboard p-8 border-success/20 bg-success/5"
            >
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4 mx-auto">
                <Check size={24} className="text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Cómo trabajamos contigo</h3>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Te mostramos ventas reales, no vanity metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Cada lead recibe seguimiento automático hasta que cierra</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Hablamos cada semana, no desaparecemos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Nos medimos por tu crecimiento, no por nuestro ego</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 text-lg font-medium text-foreground"
          >
            Tu éxito es nuestro éxito.{" "}
            <span className="text-brand">
              Por eso nos implicamos como parte de tu equipo
            </span>
            .
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
