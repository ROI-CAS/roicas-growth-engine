import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/diagnostico/components/ui/accordion";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "¿Qué incluye el diagnóstico gratuito?",
    a: "Una revisión inicial de tu situación y una conversación para orientar prioridades de web, captación y seguimiento comercial. No es un informe automático ni incluye la implementación. Si decides avanzar, definimos el alcance, los tiempos y la inversión en una propuesta aparte.",
  },
  {
    q: "¿Cuánto cuesta una página web sencilla para mi negocio?",
    a: "La One Page Express parte desde $350.000 COP (pago único): una página web profesional orientada a conversión, con diseño responsive, formulario de contacto y entrega en 2–3 días hábiles. La web multipágina completa parte desde $650.000 COP e incluye dominio, hosting y correos corporativos el primer año.",
  },
  {
    q: "¿En qué tecnología desarrollan las páginas web?",
    a: "Trabajamos principalmente con WordPress, la plataforma más usada del mundo para diseño de sitios web profesional. Su flexibilidad y robustez te permiten gestionar contenidos sin depender de programadores. En proyectos a medida también usamos otras tecnologías según la necesidad.",
  },
  {
    q: "¿Puedo actualizar la web yo mismo después?",
    a: "Sí. WordPress es muy intuitivo y te hacemos una capacitación básica para que puedas hacer cambios de texto e imágenes sin depender de nadie.",
  },
  {
    q: "¿Qué incluye el marketing digital para PyMEs?",
    a: "Gestionamos campañas en Google Ads y Meta Ads (Facebook e Instagram): segmentación, creativos, optimización continua y reportes claros con las métricas que importan. Sin permanencia mínima y con integración a tu CRM para medir conversiones reales.",
  },
  {
    q: "¿Qué pasa si quiero cancelar el servicio mensual?",
    a: "Sin problema. No manejamos contratos forzosos. Avisas con 15 días de anticipación y listo.",
  },
  {
    q: "¿Cuánto tarda en estar lista mi web?",
    a: "Entre 2 y 4 días hábiles una vez recibamos toda la información (textos, fotos, logo). El proceso empieza cuando tú nos entregas el material.",
  },
  {
    q: "¿El dominio y hosting son míos?",
    a: "Sí. Aunque los gestionamos nosotros, el dominio queda a tu nombre.",
  },
  {
    q: "¿Qué incluye el CRM con inteligencia artificial?",
    a: "Una plataforma que centraliza todos tus contactos y leads, automatiza mensajes de bienvenida y seguimiento por WhatsApp, email y SMS, y te muestra en tiempo real en qué etapa está cada cliente potencial. Todo sin intervención manual las 24 horas.",
  },
  {
    q: "¿Puedo empezar solo con la web y agregar más servicios después?",
    a: "Absolutamente. Muchos clientes empiezan con la página web para su negocio y luego van activando campañas de publicidad y automatización de ventas según crecen.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-24 md:py-32 bg-cream-deep/40">
      <div className="container max-w-3xl">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Resolvemos tus dudas
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Preguntas frecuentes
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-5 shadow-soft data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="py-5 text-left font-display text-lg font-600 text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-relaxed text-ink-soft">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
