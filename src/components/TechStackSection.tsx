import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Megaphone, MousePointerClick, MessageSquare, SlidersHorizontal, Handshake } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Atracción",
    description: "Llevamos tráfico cualificado a tu negocio mediante Google Ads, Meta Ads y posicionamiento orgánico en buscadores.",
    icon: Megaphone,
    bg: "bg-brand",
  },
  {
    number: "02",
    title: "Captación",
    description: "Páginas de captura optimizadas que convierten visitas en contactos y los registran automáticamente en tu sistema.",
    icon: MousePointerClick,
    bg: "bg-zinc-600",
  },
  {
    number: "03",
    title: "Nutrición",
    description: "Secuencias automáticas por email, SMS y WhatsApp que mantienen el interés del lead hasta que esté listo para comprar.",
    icon: MessageSquare,
    bg: "bg-emerald-500",
  },
  {
    number: "04",
    title: "Cualificación",
    description: "Sistema de scoring que filtra y prioriza automáticamente los leads con mayor intención de compra. Sin trabajo manual.",
    icon: SlidersHorizontal,
    bg: "bg-orange-500",
  },
  {
    number: "05",
    title: "Entrega al Comercial",
    description: "Tu equipo recibe la notificación con la ficha completa del lead y la cita ya agendada. Solo queda cerrar.",
    icon: Handshake,
    bg: "bg-zinc-600",
  },
];

const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-secondary/30">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            El sistema que convierte{" "}
            <span className="text-gradient-warm">desconocidos en clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un proceso automatizado de principio a fin. Cada lead que entra al sistema
            recibe atención personalizada hasta llegar a tu equipo comercial listo para cerrar.
          </p>
        </motion.div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden lg:flex items-start gap-0 relative">
          {/* Connector line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand/20 via-brand/40 to-brand/10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col items-center text-center px-4 relative"
            >
              {/* Icon square — solid vibrant color */}
              <motion.div
                whileHover={{ scale: 1.1, y: -4 }}
                transition={{ duration: 0.2 }}
                className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-5 z-10 relative shadow-md`}
              >
                <step.icon className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>

              <span className="text-xs font-bold text-muted-foreground/50 tracking-widest mb-1">
                {step.number}
              </span>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical steps */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-dashboard p-5 flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                <step.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground/50 tracking-widest">
                  {step.number}
                </span>
                <h3 className="font-bold text-base mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom result callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand/10 border border-brand/20">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <p className="text-sm font-medium text-brand">
              Resultado: tu equipo comercial solo habla con leads cualificados y con cita agendada
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
