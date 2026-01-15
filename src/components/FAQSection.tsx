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
    answer: "Leads cualificados en 2-4 semanas. Resultados significativos entre el segundo y tercer mes.",
  },
  {
    question: "¿Qué diferencia a ROICAS de otras agencias?",
    answer: "Cero métricas de vanidad. Solo leads cualificados y automatización que cierra ventas.",
  },
  {
    question: "¿Necesito tener una web?",
    answer: "No. Creamos tu presencia digital desde cero o mejoramos la existente.",
  },
  {
    question: "¿Cuánto invertir en pauta?",
    answer: "Mínimo $1,000-2,000 USD/mes. Lo definimos en la consultoría según tus objetivos.",
  },
  {
    question: "¿Ofrecen garantías?",
    answer: "Auditoría inicial gratuita. Contratos flexibles y métricas 100% transparentes.",
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
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="card-dashboard px-5 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4 text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
