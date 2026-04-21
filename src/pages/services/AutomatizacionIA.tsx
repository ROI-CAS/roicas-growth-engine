import { motion } from "framer-motion";
import { Bot, CheckCircle2, ArrowRight, Zap, MessageSquare, Clock, BrainCircuit } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";

const iaSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Automatización con IA para Ventas y Marketing",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description: "Automatiza la captación y cualificación de leads con IA. Respuesta en menos de 5 minutos 24/7, bots conversacionales, CRM automatizado y flujos inteligentes.",
  areaServed: "CO",
  url: "https://roicas.com/servicios/automatizacion-ia",
};

const benefits = [
  {
    icon: Clock,
    title: "Respuesta en menos de 5 minutos, 24/7",
    description: "Un lead que no recibe respuesta en los primeros 5 minutos tiene un 80% menos de probabilidad de cerrar. Nuestros sistemas responden al instante, siempre.",
  },
  {
    icon: MessageSquare,
    title: "Bots conversacionales que cualifican",
    description: "No son bots genéricos. Son agentes configurados con tu tono, tu propuesta de valor y tus preguntas de cualificación. El lead llega a tu equipo ya filtrado.",
  },
  {
    icon: Zap,
    title: "Flujos que nutren sin trabajo manual",
    description: "Secuencias de emails, WhatsApp y SMS activadas por el comportamiento del lead. Cada mensaje en el momento correcto, sin que tengas que tocarlo.",
  },
  {
    icon: BrainCircuit,
    title: "IA que aprende de tu negocio",
    description: "Entrenamos al agente con tu información: servicios, preguntas frecuentes, objeciones y casos de uso. Cuanto más lo usas, mejor responde.",
  },
];

const useCases = [
  {
    title: "Atención al cliente 24/7",
    desc: "Responde preguntas frecuentes, gestiona solicitudes y deriva casos complejos a tu equipo humano.",
  },
  {
    title: "Cualificación automática de leads",
    desc: "El bot hace las preguntas clave, score al lead y agenda la reunión directamente en el calendario de tu comercial.",
  },
  {
    title: "Seguimiento post-contacto",
    desc: "Si el lead no respondió, el sistema lo reactiva automáticamente a las 24h, 72h y 7 días con mensajes distintos.",
  },
  {
    title: "Onboarding de nuevos clientes",
    desc: "Flujo automático de bienvenida, recogida de información y primeros pasos sin intervención manual.",
  },
  {
    title: "Recuperación de oportunidades perdidas",
    desc: "Detecta leads inactivos en el pipeline y lanza campañas de reactivación personalizadas automáticamente.",
  },
  {
    title: "Gestión de reseñas y reputación",
    desc: "Solicita reseñas automáticamente a clientes satisfechos y gestiona las respuestas negativas antes de que escalen.",
  },
];

const faqs = [
  {
    q: "¿Esto requiere que yo tenga conocimientos técnicos?",
    a: "No. Nosotros configuramos todo el sistema, los flujos y los bots. Tú solo tienes que aprobar los mensajes y recibir las notificaciones cuando haya una acción que requiera tu atención.",
  },
  {
    q: "¿En qué canales funciona la automatización?",
    a: "Email, WhatsApp Business, SMS y chat web. Podemos activar uno o varios canales dependiendo de dónde esté tu audiencia.",
  },
  {
    q: "¿Los bots suenan robóticos?",
    a: "No si están bien configurados. Entrenamos el lenguaje con tu tono de marca. La mayoría de usuarios no saben que hablan con un bot en las primeras interacciones.",
  },
  {
    q: "¿Qué pasa con leads que tienen preguntas complejas?",
    a: "El sistema detecta cuando la pregunta supera su alcance y escala la conversación a un humano con el historial completo. Nunca pierde el contexto.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const AutomatizacionIA = () => {
  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Automatización con IA para Ventas | Bots y Flujos | ROICAS"
        description="Automatiza la captación y cualificación de leads con IA. Respuesta en menos de 5 minutos 24/7. Bots conversacionales, CRM automatizado y seguimiento inteligente."
        canonical="https://roicas.com/servicios/automatizacion-ia"
        schemaJson={iaSchema}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              <Bot size={14} />
              Automatización con IA
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tu equipo comercial trabaja.{" "}
              <span className="text-primary">La IA no descansa.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Implementamos flujos inteligentes y agentes conversacionales con IA que
              captan, nutren y cualifican leads automáticamente — las 24 horas,
              los 7 días de la semana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="/contacto" className="group">
                  Automatizar mi proceso de ventas
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="/contacto">Ver demo en vivo</a>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="section-container">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              El tiempo de respuesta{" "}
              <span className="text-muted-foreground">lo cambia todo</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              El 78% de los clientes compra al primero que le responde.
              Con automatización inteligente, siempre eres tú el primero.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { stat: "78%", desc: "compra al primero que responde" },
              { stat: "80%", desc: "menos probabilidad de cerrar si no respondes en 5 min" },
              { stat: "3×", desc: "más citas agendadas con seguimiento automatizado" },
            ].map((item) => (
              <div key={item.stat} className="card-dashboard p-6 text-center">
                <p className="text-4xl font-black text-primary mb-2">{item.stat}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Qué hace la IA{" "}
              <span className="text-muted-foreground">por tu negocio</span>
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

      {/* Use Cases */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Casos de uso{" "}
              <span className="text-muted-foreground">más comunes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estos son los flujos que implementamos con mayor frecuencia.
              Pero cada sistema se diseña a medida de tu proceso.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dashboard p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bot size={18} className="text-primary" />
                </div>
                <h3 className="font-bold mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Preguntas frecuentes</h2>
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
              ¿Cuántos leads estás perdiendo{" "}
              <span className="text-muted-foreground">por falta de seguimiento?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              En una llamada de 20 minutos diseñamos contigo el primer flujo
              que puedes activar esta semana.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Agendar llamada gratis
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">✓ Sin permanencias · ✓ Primera implementación en días</p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default AutomatizacionIA;
