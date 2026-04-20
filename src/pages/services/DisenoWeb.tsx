import { motion } from "framer-motion";
import { Globe, CheckCircle2, ArrowRight, Zap, TrendingUp, Shield, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Zap,
    title: "Carga en menos de 3 segundos",
    description: "Sitios optimizados para velocidad. Google rankea más alto los sitios rápidos y los usuarios no esperan.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first por defecto",
    description: "Más del 70% de tus visitas llegan desde el móvil. Diseñamos pensando en ese usuario primero.",
  },
  {
    icon: TrendingUp,
    title: "Diseñado para convertir",
    description: "No es solo una web bonita. Cada sección, cada botón, cada texto está pensado para que el visitante dé el siguiente paso.",
  },
  {
    icon: Shield,
    title: "Seguridad y mantenimiento",
    description: "SSL, backups automáticos, actualizaciones y soporte continuo. Tu web siempre disponible.",
  },
];

const includes = [
  "Diseño personalizado a tu marca (no plantillas genéricas)",
  "Arquitectura de información y mapa del sitio",
  "Copywriting orientado a conversión",
  "SEO técnico base incluido",
  "Integración con CRM y formularios de captura",
  "Páginas: Inicio, Servicios, Sobre nosotros, Contacto",
  "Blog o sección de recursos (opcional)",
  "Google Analytics y seguimiento de conversiones",
  "Optimización de velocidad (Core Web Vitals)",
  "Certificado SSL y configuración de seguridad",
];

const faqs = [
  {
    q: "¿Cuánto tiempo tarda la entrega?",
    a: "Dependiendo de la complejidad, entre 3 y 6 semanas. En nuestra llamada inicial definimos el alcance y te damos una fecha realista.",
  },
  {
    q: "¿Puedo actualizar el contenido yo mismo?",
    a: "Sí. WordPress te permite editar textos, imágenes y páginas sin saber programar. Te entregamos formación incluida.",
  },
  {
    q: "¿Está incluido el hosting?",
    a: "No incluimos hosting en el precio del proyecto, pero te asesoramos para contratar el más adecuado a tu negocio y presupuesto.",
  },
  {
    q: "¿Qué pasa después de la entrega?",
    a: "Ofrecemos planes de mantenimiento mensual para actualizaciones, seguridad y soporte. Muchos clientes eligen seguir trabajando con nosotros.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const DisenoWeb = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div
            {...fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              <Globe size={14} />
              Diseño Web
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tu web tiene que{" "}
              <span className="text-primary">conseguir clientes,</span>{" "}
              no solo existir
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Creamos sitios web en WordPress que cargan rápido, se ven profesionales
              y están diseñados desde el primer pixel para convertir visitantes en contactos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="/contacto" className="group">
                  Quiero mi web nueva
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="/contacto">Ver ejemplos de trabajo</a>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Problem */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="section-container">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              La mayoría de webs fallan{" "}
              <span className="text-muted-foreground">antes de empezar</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Una web sin estrategia es solo un gasto. Tarda en cargar, nadie sabe qué ofreces
              en los primeros 5 segundos, y el botón de "Contacto" lleva a un formulario
              que nadie rellena. Te suena familiar.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                { stat: "53%", desc: "de usuarios abandona si la web tarda más de 3 segundos" },
                { stat: "8 seg", desc: "es el tiempo promedio de atención antes de salir" },
                { stat: "75%", desc: "de credibilidad percibida viene del diseño web" },
              ].map((item) => (
                <div key={item.stat} className="card-dashboard p-6 text-center">
                  <p className="text-4xl font-black text-primary mb-2">{item.stat}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Cómo construimos{" "}
              <span className="text-muted-foreground">webs que funcionan</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dashboard p-8 flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Qué incluye{" "}
                <span className="text-muted-foreground">tu nuevo sitio web</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Nada de sorpresas ni extras ocultos. Esto es lo que recibes
                en cada proyecto de diseño web.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="/contacto" className="group">
                  Solicitar presupuesto
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Preguntas frecuentes
            </h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dashboard p-6"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              ¿Listo para una web que{" "}
              <span className="text-muted-foreground">trabaja para ti?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Cuéntanos tu proyecto en una llamada de 20 minutos.
              Sin compromiso, sin presión. Solo una conversación honesta.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Agendar llamada gratis
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">✓ Sin permanencias · ✓ Presupuesto sin compromiso</p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default DisenoWeb;
