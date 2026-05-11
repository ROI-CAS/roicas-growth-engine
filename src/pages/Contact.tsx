import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Calendar, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/gEm0YwOkG4AarjCYtCq9";

const contactInfo = [
  { icon: Mail, title: "Email", value: "hola@roicas.com", link: "mailto:hola@roicas.com" },
  { icon: Phone, title: "Teléfono", value: "+57 311 456 5403", link: "tel:+573114565403" },
  { icon: MapPin, title: "Ubicación", value: "Bogotá, Colombia", link: null },
  { icon: Clock, title: "Horario", value: "Lun - Vie: 9am - 6pm", link: null },
];

type Tab = "calendar" | "form";

const Contact = () => {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");

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
              Elige cómo prefieres hablar con nosotros — agenda una llamada o
              déjanos un mensaje.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tab Switcher + Content */}
      <section className="py-12 md:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl mb-8 w-fit mx-auto">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === "calendar"
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar size={15} />
                Agenda llamada · 20 min
              </button>
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === "form"
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare size={15} />
                Envíanos un mensaje
              </button>
            </div>

            {/* Calendar tab */}
            {activeTab === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border overflow-hidden shadow-card"
              >
                {/* Calendar header context */}
                <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Consultoría estratégica gratuita</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      20 minutos · Sin compromiso · Respuesta hoy
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border rounded-lg px-3 py-1.5">
                    <Clock size={12} />
                    20 min
                  </div>
                </div>

                <iframe
                  src={BOOKING_URL}
                  id="gEm0YwOkG4AarjCYtCq9_contact"
                  style={{ width: "100%", border: "none", minHeight: "680px", display: "block" }}
                  scrolling="no"
                  title="Agendar consultoría de 20 minutos con ROICAS"
                />
              </motion.div>
            )}

            {/* Form tab */}
            {activeTab === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContactForm variant="full" />
              </motion.div>
            )}
          </motion.div>
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
