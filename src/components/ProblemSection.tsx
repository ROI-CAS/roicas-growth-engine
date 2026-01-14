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
            ¿Harto de las{" "}
            <span className="text-gradient">"Métricas de Vanidad"</span>?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Muchas agencias te entregan reportes llenos de impresiones y clics,
            pero tu facturación sigue igual y te sientes abandonado. En ROICAS,
            entendemos que un lead sin seguimiento es dinero tirado a la basura.
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
              <h3 className="text-xl font-semibold mb-4">El Problema Habitual</h3>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Reportes con miles de impresiones pero cero ventas</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Leads que nunca reciben seguimiento</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Sentirse abandonado después de firmar el contrato</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-1 shrink-0" />
                  <span>Facturación estancada a pesar del "éxito" de campañas</span>
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
              <h3 className="text-xl font-semibold mb-4">La Solución ROICAS</h3>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Métricas enfocadas en ventas reales y ROI</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Automatización que nutre cada lead hasta el cierre</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Acompañamiento continuo en todo el proceso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success mt-1 shrink-0" />
                  <span>Maquinaria de ventas que funciona para ti 24/7</span>
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
            No te entregamos solo datos;{" "}
            <span className="text-primary">
              implementamos una maquinaria de ventas que funciona para ti
            </span>
            .
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
