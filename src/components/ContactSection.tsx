import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  const { openBooking } = useBooking();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    { icon: Calendar, text: "Primera llamada sin coste" },
    { icon: Zap, text: "Te respondemos hoy" },
    { icon: Shield, text: "Cero spam, prometido" },
  ];

  return (
    <section id="contacto" className="py-20 md:py-28 bg-secondary">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand">
                ¿Listo para dar el{" "}
                <span className="text-gradient-warm">siguiente paso</span>?
              </h2>

              <p className="text-lg text-muted-foreground">
                Cuéntanos sobre tu negocio y te diremos honestamente si podemos 
                ayudarte. Sin compromiso, sin presión. Solo una conversación 
                para conocernos.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                      <benefit.icon size={20} className="text-brand" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Booking CTA */}
              <div className="pt-2">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={openBooking}
                  className="cursor-pointer group"
                >
                  <Calendar size={18} className="mr-2" />
                  Agendar llamada de 20 min
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  O completa el formulario y te contactamos hoy.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactForm 
                variant="full" 
                showTitle={false}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
