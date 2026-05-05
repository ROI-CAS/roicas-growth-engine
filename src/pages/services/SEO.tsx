import { motion } from "framer-motion";
import { Search, CheckCircle2, ArrowRight, TrendingUp, FileText, Link, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";

const seoSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "SEO — Posicionamiento Web en Google",
    provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
    description: "Posicionamiento orgánico en Google para empresas B2B en Colombia. Auditoría técnica, investigación de palabras clave, contenido y linkbuilding.",
    areaServed: "CO",
    url: "https://roicas.com/servicios/seo",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "¿Cuánto tiempo tarda en verse resultados?", acceptedAnswer: { "@type": "Answer", text: "Los primeros movimientos se ven a partir del tercer mes. Resultados significativos, entre 6 y 12 meses." } },
      { "@type": "Question", name: "¿El SEO reemplaza la publicidad paga?", acceptedAnswer: { "@type": "Answer", text: "Son complementarios. La publicidad da resultados inmediatos mientras el SEO construye la base orgánica." } },
      { "@type": "Question", name: "¿Garantizan el primer puesto en Google?", acceptedAnswer: { "@type": "Answer", text: "Nadie puede garantizarlo honestamente. Lo que sí garantizamos es un trabajo técnico y de contenido serio que mejora consistentemente tu visibilidad orgánica." } },
      { "@type": "Question", name: "¿Trabajan SEO local?", acceptedAnswer: { "@type": "Answer", text: "Sí. Si tu negocio atiende una zona geográfica concreta, optimizamos Google Business Profile y el SEO local para aparecer en las búsquedas de tu área." } },
    ],
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Tráfico que crece con el tiempo",
    description: "A diferencia de la publicidad paga, el SEO acumula. Cada mes que pasa, tu posición mejora y el tráfico orgánico crece sin incrementar el presupuesto.",
  },
  {
    icon: FileText,
    title: "Contenido que atrae y convierte",
    description: "Creamos la estrategia de contenido que responde exactamente lo que buscan tus clientes potenciales antes de tomar una decisión de compra.",
  },
  {
    icon: Link,
    title: "Autoridad de dominio y linkbuilding",
    description: "Construimos la autoridad de tu sitio con enlaces de calidad que Google valora. Sin trucos, sin penalizaciones.",
  },
  {
    icon: Clock,
    title: "Resultados sostenibles",
    description: "Los primeros resultados se ven en 3-4 meses. A partir del sexto mes, el canal orgánico suele ser el de mayor ROI de toda tu estrategia.",
  },
];

const process = [
  { step: "01", title: "Auditoría técnica", desc: "Velocidad, indexación, errores, estructura de URLs y Core Web Vitals." },
  { step: "02", title: "Investigación de palabras clave", desc: "Identificamos los términos que usan tus clientes para encontrar lo que vendes." },
  { step: "03", title: "Optimización on-page", desc: "Títulos, metas, contenido, headings y arquitectura de información." },
  { step: "04", title: "Creación de contenido", desc: "Artículos, páginas y recursos que posicionan y educan a tu audiencia." },
  { step: "05", title: "SEO técnico continuo", desc: "Monitoreo, ajustes y mejoras según los cambios del algoritmo." },
  { step: "06", title: "Reportes de posicionamiento", desc: "Informe mensual con posiciones, tráfico orgánico y oportunidades detectadas." },
];

const faqs = [
  {
    q: "¿Cuánto tiempo tarda en verse resultados?",
    a: "Depende de la competencia de tu sector y el estado actual de tu web. En general, los primeros movimientos se ven a partir del tercer mes. Resultados significativos, entre 6 y 12 meses.",
  },
  {
    q: "¿El SEO reemplaza la publicidad paga?",
    a: "Son complementarios. La publicidad da resultados inmediatos mientras el SEO construye la base orgánica. Con el tiempo, el SEO reduce tu dependencia de la publicidad.",
  },
  {
    q: "¿Garantizan el primer puesto en Google?",
    a: "Nadie puede garantizarlo honestamente. Lo que sí garantizamos es un trabajo técnico y de contenido serio que mejora consistentemente tu visibilidad orgánica.",
  },
  {
    q: "¿Trabajan SEO local?",
    a: "Sí. Si tu negocio atiende una zona geográfica concreta (ciudad, barrio), optimizamos Google Business Profile y el SEO local para aparecer en las búsquedas de tu área.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SEO = () => {
  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Agencia SEO en Colombia | Posicionamiento Web | ROICAS"
        description="Posicionamos tu web en Google para que tus clientes te encuentren primero. 342 keywords en top 3 y 85K impresiones/mes para nuestros clientes. Sin permanencias."
        canonical="https://roicas.com/servicios/seo"
        schemaJson={seoSchema}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6 border border-brand/20">
              <Search size={14} />
              SEO
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Aparece primero cuando{" "}
              <span className="text-gradient-warm">tu cliente ideal</span>{" "}
              está buscando
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Posicionamos tu web en Google para que los clientes que ya buscan lo que
              ofreces te encuentren a ti primero — no a tu competencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="/contacto" className="group">
                  Quiero más tráfico orgánico
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="/contacto">Auditoría gratuita</a>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              El canal con{" "}
              <span className="text-gradient-warm">mayor ROI a largo plazo</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              El 93% de las experiencias online empiezan con una búsqueda.
              Si no estás en la primera página, prácticamente no existes.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { stat: "93%", desc: "de las experiencias online comienzan en un buscador" },
              { stat: "75%", desc: "de usuarios nunca pasa de la primera página" },
              { stat: "14×", desc: "mayor ROI vs publicidad outbound" },
            ].map((item) => (
              <div key={item.stat} className="card-dashboard p-6 text-center">
                <p className="text-4xl font-black text-brand mb-2">{item.stat}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por qué el SEO{" "}
              <span className="text-gradient-warm">es diferente</span>
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
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6 text-brand" />
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

      {/* Process */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo trabajamos{" "}
              <span className="text-gradient-warm">el SEO</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dashboard p-6"
              >
                <span className="text-3xl font-black text-border/60 block mb-3">{p.step}</span>
                <h3 className="font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Preguntas frecuentes</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Quieres saber dónde{" "}
              <span className="text-gradient-warm">está tu web ahora mismo?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Hacemos una auditoría básica gratuita de tu sitio en la llamada.
              Sin compromiso, sin trampas.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Solicitar auditoría gratuita
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">✓ Sin permanencias · ✓ Revisión honesta</p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default SEO;
