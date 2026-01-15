import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cuánto tiempo toma ver resultados?",
    answer:
      "Generalmente, nuestros clientes comienzan a ver leads cualificados en las primeras 2-4 semanas. Resultados significativos en conversión y ventas suelen manifestarse entre el segundo y tercer mes, dependiendo del sector y la madurez del embudo actual.",
  },
  {
    question: "¿Trabajan con empresas pequeñas o solo grandes corporaciones?",
    answer:
      "Trabajamos principalmente con empresas B2B que facturen desde $50K USD anuales y tengan un equipo comercial dispuesto a cerrar leads. No importa el tamaño, sino la disposición a crecer y la capacidad de atender oportunidades.",
  },
  {
    question: "¿Qué diferencia a ROICAS de otras agencias de marketing?",
    answer:
      "No vendemos 'likes' ni métricas de vanidad. Nos enfocamos exclusivamente en generar leads cualificados y acompañarlos hasta el cierre mediante automatización inteligente. Solo ganamos si tú ganas.",
  },
  {
    question: "¿Necesito tener una web antes de contratar sus servicios?",
    answer:
      "No es indispensable. Podemos crear tu presencia digital desde cero, incluyendo diseño web optimizado para conversión, o mejorar tu sitio actual para maximizar resultados.",
  },
  {
    question: "¿Cuánto debo invertir en pauta publicitaria?",
    answer:
      "Recomendamos un mínimo de $1,000-2,000 USD mensuales en pauta para campañas B2B efectivas. Sin embargo, esto se define en la consultoría inicial según tus objetivos y mercado específico.",
  },
  {
    question: "¿Ofrecen garantías de resultados?",
    answer:
      "Ofrecemos una auditoría inicial gratuita donde identificamos oportunidades reales. Nuestros contratos son flexibles y trabajamos con métricas transparentes. Si no funcionamos para ti, no te atamos.",
  },
  {
    question: "¿Cómo miden el éxito de las campañas?",
    answer:
      "Medimos leads cualificados, costo por adquisición, tasa de conversión y ROI real. Proporcionamos dashboards en tiempo real para que veas exactamente cómo performan tus campañas.",
  },
  {
    question: "¿En qué países operan?",
    answer:
      "Operamos en toda Latinoamérica y España. Nuestro equipo está distribuido para atender diferentes zonas horarias y entender los mercados locales.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Preguntas <span className="text-gradient-warm">Frecuentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resolvemos tus dudas para que tomes la mejor decisión para tu negocio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-dashboard px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
