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
    question: "¿En cuánto tiempo empezaré a ver resultados?",
    answer: "Normalmente en las primeras 2-4 semanas ya empiezas a recibir leads cualificados. Los resultados más significativos llegan entre el segundo y tercer mes, cuando el sistema está completamente optimizado.",
  },
  {
    question: "¿Por qué debería elegiros a vosotros?",
    answer: "Porque no te vamos a vender humo. Nos medimos por tus ventas, no por likes. Y lo más importante: no desaparecemos después de firmar. Somos parte de tu equipo.",
  },
  {
    question: "No tengo web, ¿es problema?",
    answer: "Para nada. Podemos crearla desde cero o mejorar la que ya tienes. Lo importante es tener una base sólida antes de invertir en publicidad.",
  },
  {
    question: "¿Cuánto necesito invertir en publicidad?",
    answer: "Depende de tu sector y objetivos, pero como referencia, recomendamos un mínimo de $1,000-2,000 USD/mes en pauta. Lo definimos juntos en una primera conversación.",
  },
  {
    question: "¿Hay permanencia o compromiso largo?",
    answer: "No nos gustan las ataduras. Trabajamos mes a mes porque creemos que si hacemos bien nuestro trabajo, querrás seguir con nosotros. Así de simple.",
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
            Lo que seguro te estás <span className="text-gradient-warm">preguntando</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Son las dudas que todos tienen antes de dar el paso. Aquí van las respuestas honestas.
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
