import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Calendar } from "lucide-react";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";

const contactInfo = [
  { icon: Mail, title: "Email", value: "hola@roicas.com", link: "mailto:hola@roicas.com" },
  { icon: Phone, title: "Teléfono", value: "+57 311 456 5403", link: "tel:+573114565403" },
  { icon: MapPin, title: "Ubicación", value: "Bogotá, Colombia", link: null },
  { icon: Clock, title: "Horario", value: "Lun - Vie: 9am - 6pm", link: null },
];

const Contact = () => {
  const { openBooking } = useBooking();

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Contacto | Agenda una Consultoría Gratis | ROICAS"
        description="Agenda una llamada gratuita de 20 minutos con nuestro equipo. Hablamos de tu negocio, tus objetivos y te proponemos el sistema que mejor encaja. Sin permanencias ni compromiso."
        canonical="https://roicas.com/contacto"
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6 border border-brand/20"
            >
              Hablemos de tu proyecto
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              ¿Listo para{" "}
              <span className="text-gradient-warm">crecer</span>?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-lg text-muted-foreground"
            >
              Déjanos tus datos y te contactamos hoy, o agenda directamente
              una llamada de 20 minutos.
            </motion.p>

            {/* Calendar shortcut */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-6"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={openBooking}
                className="cursor-pointer"
              >
                <Calendar size={17} className="mr-2" />
                Agendar llamada · 20 min
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14 md:py-20">
        <div className="section-container">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ContactForm variant="full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact info strip */}
      <section className="py-12 bg-muted/50 border-t border-border">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-4"
              >
                <info.icon className="w-5 h-5 text-brand mx-auto mb-2" />
                <p className="font-medium text-sm text-foreground">{info.title}</p>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{info.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Contact;
