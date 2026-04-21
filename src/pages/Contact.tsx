import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hola@roicas.com",
    link: "mailto:hola@roicas.com"
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: "+57 311 456 5403",
    link: "tel:+573114565403"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    value: "Bogotá, Colombia",
    link: null
  },
  {
    icon: Clock,
    title: "Horario",
    value: "Lun - Vie: 9am - 6pm",
    link: null
  }
];

const Contact = () => {
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true });

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Contacto | Agenda una Consultoría Gratis | ROICAS"
        description="Agenda una llamada gratuita con nuestro equipo. Hablamos de tu negocio, tus objetivos y te proponemos el sistema que mejor encaja. Sin permanencias ni compromiso."
        canonical="https://roicas.com/contacto"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block px-4 py-2 rounded-full bg-warm/10 text-warm text-sm font-medium mb-6"
            >
              Hablemos de tu proyecto
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              ¿Listo para <span className="text-gradient-warm">crecer</span>?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-muted-foreground"
            >
              Cuéntanos sobre tu negocio y te mostraremos cómo podemos ayudarte a escalar tus ventas.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <ContactForm variant="full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info - Simplified */}
      <section className="py-12 bg-muted/50">
        <div className="section-container">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4"
              >
                <info.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">{info.title}</p>
                {info.link ? (
                  <a href={info.link} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
