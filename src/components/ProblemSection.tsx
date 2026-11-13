import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { XCircle, CheckCircle2, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { openBooking } = useBooking();

  return (
    <section id="nosotros" className="py-24 md:py-32 relative overflow-hidden bg-muted/30 border-y border-border/80">
      {/* Luces volumétricas sutiles */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs sm:text-sm font-semibold mb-4 border border-brand/20">
            <Layers size={13} />
            Metodología y Enfoque de Trabajo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            Más allá de métricas superficiales.{" "}
            <span className="text-gradient">Construimos sistemas orientados a resultados comerciales.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Comprendemos la necesidad de contar con soluciones digitales que realmente apoyen la operación de tu empresa: sitios web veloces, atención ágil a prospectos e información clara sobre el rendimiento de cada canal.
          </p>
        </motion.div>

        {/* Comparativa Consultiva */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: El Enfoque Convencional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-8 sm:p-10 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground uppercase tracking-wider mb-6">
                El Enfoque Convencional
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Estrategias fragmentadas y procesos manuales
              </h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Acciones aisladas de pauta o diseño que generan tráfico pero carecen de una estructura organizada para atender y convertir a los interesados.
              </p>

              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <XCircle size={18} className="text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span><strong>Reportes Desconectados:</strong> Informes centrados en impresiones o interacciones sin vínculo directo con oportunidades de negocio.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle size={18} className="text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span><strong>Demoras en la Atención:</strong> Prospectos que esperan horas por una respuesta inicial en WhatsApp, perdiendo el interés comercial.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle size={18} className="text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span><strong>Páginas Lentas:</strong> Sitios web poco optimizados para dispositivos móviles que generan fricción y abandono del usuario.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle size={18} className="text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span><strong>Contratos Rígidos:</strong> Permanencias forzadas a largo plazo sin revisiones periódicas sobre el valor real entregado.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-8 border-t border-border text-xs text-muted-foreground italic">
              Impacto: Pérdida de prospectos interesados y dificultad para medir el retorno de la inversión.
            </div>
          </motion.div>

          {/* Card 2: El Enfoque ROICAS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl border-2 border-brand/40 bg-gradient-to-b from-card via-card to-brand/5 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-brand/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand text-white shadow-sm uppercase tracking-wider mb-6">
                Metodología ROICAS
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Infraestructura integrada y atención ágil
              </h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Coordinamos el desarrollo web, la captación de tráfico con intención y la automatización de respuestas para crear un proceso comercial predecible.
              </p>

              <ul className="space-y-4 text-sm text-foreground/90">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                  <span><strong>Métricas de Negocio Claras:</strong> Seguimiento del costo por cliente potencial adquirido (CAC) y volumen de solicitudes válidas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                  <span><strong>Atención Inmediata con IA:</strong> Asistentes inteligentes que atienden dudas iniciales y agendan llamadas en WhatsApp 24/7.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                  <span><strong>Desarrollo Web de Alto Rendimiento:</strong> Plataformas ligeras, rápidas y adaptadas a pasarelas de pago colombianas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                  <span><strong>Flexibilidad y Transparencia:</strong> Sin cláusulas de permanencia forzadas; sostenemos la relación con base en la calidad del servicio.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-8 border-t border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-brand flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Acompañamiento cercano y técnico
              </span>
              <button
                onClick={openBooking}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-brand transition-colors cursor-pointer"
              >
                <span>Conocer nuestro método</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
