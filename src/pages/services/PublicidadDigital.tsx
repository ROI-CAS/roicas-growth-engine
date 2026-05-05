import { motion } from "framer-motion";
import { Megaphone, CheckCircle2, ArrowRight, Target, DollarSign, BarChart3, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";

const pubDigitalSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Publicidad Digital — Google Ads y Meta Ads",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description: "Gestión de campañas en Google Ads y Meta Ads con ROI medible desde el primer día. Optimización continua, segmentación precisa y reportes transparentes.",
  areaServed: "CO",
  url: "https://roicas.com/servicios/publicidad-digital",
};

const benefits = [
  {
    icon: Target,
    title: "Audiencias precisas, no gasto desperdiciado",
    description: "Mostramos tu anuncio solo a personas con el perfil, intereses y comportamiento de tu cliente ideal. Nada de impactar a quien nunca te va a comprar.",
  },
  {
    icon: DollarSign,
    title: "ROI medible desde el primer día",
    description: "Sabes exactamente cuánto gastas y cuánto ganas. Cada euro invertido tiene su seguimiento: impresiones, clics, leads y ventas atribuidas.",
  },
  {
    icon: BarChart3,
    title: "Optimización continua",
    description: "Analizamos el rendimiento semanalmente y ajustamos pujas, creatividades y audiencias para que el coste por lead baje con el tiempo.",
  },
  {
    icon: RefreshCw,
    title: "Google Ads y Meta Ads integrados",
    description: "Coordinamos ambas plataformas para captar a tu cliente ideal en el momento de búsqueda (Google) y en el de descubrimiento (Meta).",
  },
];

const platforms = [
  {
    name: "Google Ads",
    desc: "Captura la demanda activa. Aparece cuando alguien busca exactamente lo que vendes.",
    items: ["Search y Shopping", "Performance Max", "Remarketing dinámico", "Extensiones de anuncio"],
  },
  {
    name: "Meta Ads",
    desc: "Genera demanda nueva. Llega a tu cliente ideal antes de que te busque.",
    items: ["Campañas de conversión", "Lead Ads", "Retargeting por comportamiento", "Audiencias similares (Lookalike)"],
  },
];

const faqs = [
  {
    q: "¿Cuánto presupuesto mínimo necesito?",
    a: "Dependiendo del sector, con 500.000 COP/mes ya se pueden ver resultados en Meta Ads. En Google, recomendamos un mínimo de 800.000 COP para campañas de búsqueda competitivas.",
  },
  {
    q: "¿Crean los anuncios o solo los gestionan?",
    a: "Hacemos todo: estrategia, copywriting, diseño de creatividades, configuración, seguimiento y optimización continua. Solo necesitamos que nos cuentes tu negocio.",
  },
  {
    q: "¿Cuánto cobran de gestión?",
    a: "Nuestros honorarios de gestión son independientes del presupuesto publicitario. Lo definimos en la llamada según el alcance de las campañas.",
  },
  {
    q: "¿Qué pasa si los anuncios no convierten?",
    a: "Analizamos la causa: puede ser el anuncio, la audiencia o la página de destino. Ajustamos hasta encontrar lo que funciona. Nunca nos quedamos sin hacer nada.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const PublicidadDigital = () => {
  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Publicidad Digital Google Ads y Meta Ads Colombia | ROICAS"
        description="Campañas de Google Ads y Meta Ads con ROI medible desde el primer día. Leads cualificados, optimización continua y reportes transparentes para tu negocio."
        canonical="https://roicas.com/servicios/publicidad-digital"
        schemaJson={pubDigitalSchema}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6 border border-brand/20">
              <Megaphone size={14} />
              Publicidad Digital
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Cada peso invertido{" "}
              <span className="text-gradient-warm">tiene que traer resultados.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gestionamos campañas en Google Ads y Meta Ads con una sola obsesión:
              conseguirte leads cualificados al menor coste posible y con total transparencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="/contacto" className="group">
                  Activar mis campañas
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="/contacto">Ver casos de éxito</a>
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
              La publicidad que funciona{" "}
              <span className="text-gradient-warm">no es cuestión de suerte</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              La mayoría de empresas pierde dinero en publicidad digital porque no tiene
              la estrategia correcta ni hace los ajustes necesarios. Ahí es donde entramos nosotros.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { stat: "4.2×", desc: "ROI promedio de nuestras campañas activas" },
              { stat: "−40%", desc: "reducción de coste por lead en primeros 3 meses" },
              { stat: "48h", desc: "para tener tus campañas activas y generando" },
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
              Cómo gestionamos{" "}
              <span className="text-gradient-warm">tu publicidad</span>
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

      {/* Platforms */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Las plataformas que{" "}
              <span className="text-gradient-warm">dominamos</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dashboard p-8"
              >
                <h3 className="text-xl font-bold mb-4">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-brand shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
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
              ¿Cuánto estás perdiendo{" "}
              <span className="text-gradient-warm">sin publicidad optimizada?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              En una llamada de 20 minutos revisamos tu situación actual y te decimos
              qué palancas tienen más impacto en tu caso concreto.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Agendar llamada gratis
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">✓ Sin permanencias · ✓ Análisis honesto</p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default PublicidadDigital;
