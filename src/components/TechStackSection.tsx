import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Megaphone,
  MousePointerClick,
  Bot,
  SlidersHorizontal,
  Handshake,
  ArrowRight,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    tag: "ATRACCIÓN",
    title: "Tráfico de Alta Intención",
    description:
      "Capturamos prospectos con intención de compra activa mediante Google Search, SEO local y campañas de alta conversión en Meta.",
    icon: Megaphone,
  },
  {
    number: "02",
    tag: "CONVERSIÓN",
    title: "Plataforma Mobile-First",
    description:
      "Aterrizan en páginas ultrarrápidas (<1s) y tiendas con checkout optimizado para Colombia que eliminan la fuga de compradores.",
    icon: MousePointerClick,
  },
  {
    number: "03",
    tag: "INTELIGENCIA",
    title: "Cualificación Inmediata con IA",
    description:
      "Nuestros agentes de IA responden por WhatsApp en menos de 5 segundos, responden dudas y filtran por presupuesto 24/7.",
    icon: Bot,
  },
  {
    number: "04",
    tag: "SINCRONIZACIÓN",
    title: "Automatización & CRM",
    description:
      "El lead se registra automáticamente en tu CRM (HubSpot, Holded o Salesforce) con todos sus datos verificados y trazabilidad.",
    icon: SlidersHorizontal,
  },
  {
    number: "05",
    tag: "CIERRE",
    title: "Entrega al Equipo Comercial",
    description:
      "Tu vendedor recibe una alerta con la ficha completa y la cita ya agendada en el calendario. Solo tiene que presentarse y cerrar.",
    icon: Handshake,
  },
];

export default function TechStackSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="como-funciona" className="py-24 md:py-32 relative overflow-hidden bg-card/30 border-y border-border/80">
      {/* Luz volumétrica de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[20rem] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Encabezado con tipografía de alto impacto */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs sm:text-sm font-semibold mb-4 border border-brand/20">
            <Zap size={13} />
            Metodología de Conversión Continua
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            El pipeline que transforma visitas anónimas en contratos firmados
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
            Eliminamos el seguimiento manual y la pérdida de clientes por demoras. Diseñamos un flujo coordinado donde cada etapa eleva la probabilidad de cierre.
          </p>
        </motion.div>

        {/* Desktop Pipeline Horizontal */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative items-stretch">
          {/* Línea conectora luminosa */}
          <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand/20 via-brand to-brand/20 pointer-events-none" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="glow-card rounded-2xl p-6 bg-card/80 backdrop-blur-sm flex flex-col justify-between relative group z-10 border border-border/80 hover:border-brand/40"
            >
              <div>
                {/* Header del nodo */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/25 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                    <step.icon size={20} strokeWidth={2.2} />
                  </div>
                  <span className="text-xs font-mono font-extrabold text-muted-foreground/60 tracking-wider">
                    {step.number}
                  </span>
                </div>

                <p className="text-[11px] font-mono uppercase tracking-widest text-brand font-bold mb-1.5">
                  {step.tag}
                </p>
                <h3 className="font-bold text-base text-foreground mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-[11px] font-semibold text-brand gap-1 group-hover:translate-x-1 transition-transform">
                <span>Paso {index + 1} de 5</span>
                <ArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile & Tablet: Tarjetas Verticales con Espaciado Generoso */}
        <div className="lg:hidden space-y-4 sm:space-y-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 rounded-2xl bg-card border border-border/80 flex items-start gap-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/25 flex items-center justify-center text-brand shrink-0">
                <step.icon size={22} strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-brand font-bold">
                    {step.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted-foreground/60">
                    {step.number}/05
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout de Resultado Comercial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand/10 border border-brand/25 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              Resultado final: Tu equipo comercial <span className="text-brand font-bold">solo habla con prospectos calificados</span> y con cita confirmada.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
