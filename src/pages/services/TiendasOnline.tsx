import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle2, ArrowRight, CreditCard, Package, BarChart3, Headphones } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";
import { Link } from "react-router-dom";

const tiendasSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Tiendas Online y E-commerce en Colombia",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description: "E-commerce con WooCommerce para el mercado colombiano. Integración con PSE, Nequi y Bancolombia. Gestión de inventario, automatización post-venta y analytics de ventas.",
  areaServed: "CO",
  url: "https://roicas.com/servicios/tiendas-online",
};

const benefits = [
  {
    icon: CreditCard,
    title: "Pagos integrados desde el día 1",
    description: "PSE, tarjetas de crédito, Nequi, Bancolombia y más. Tu cliente paga como quiere y tú cobras automáticamente.",
  },
  {
    icon: Package,
    title: "Gestión de inventario sin complicaciones",
    description: "Stock en tiempo real, alertas de agotado, variantes de producto (tallas, colores, referencias). Todo centralizado.",
  },
  {
    icon: BarChart3,
    title: "Analytics de ventas integrado",
    description: "Sabe qué productos se venden más, de dónde vienen tus compradores y en qué punto abandonan el carrito.",
  },
  {
    icon: Headphones,
    title: "Automatización post-venta",
    description: "Confirmaciones, seguimiento de envío, solicitudes de reseña y recuperación de carritos abandonados — todo automático.",
  },
];

const includes = [
  "Tienda configurada y lista para vender",
  "Pasarela de pagos integrada (PSE, tarjetas, billeteras digitales)",
  "Catálogo de productos ilimitado",
  "Carrito y checkout optimizado para conversión",
  "Gestión de stock e inventario",
  "Página de inicio, colecciones y ficha de producto",
  "Emails transaccionales automáticos",
  "Cupones y descuentos configurables",
  "SEO de producto incluido",
  "Integración con WhatsApp para soporte",
];

const faqs = [
  {
    q: "¿Con qué plataforma construyen la tienda?",
    a: "WooCommerce sobre WordPress es nuestra especialidad para el mercado colombiano. Es flexible, escalable y te da control total sin depender de plataformas de suscripción.",
  },
  {
    q: "¿Puedo vender productos físicos y digitales?",
    a: "Sí. Configuramos tu tienda para vender lo que necesites: productos físicos con envío, productos digitales con descarga automática, o servicios.",
  },
  {
    q: "¿Está integrado con transportistas?",
    a: "Sí. Podemos integrar con Servientrega, Interrapidísimo, Enví y otras opciones. También calculadoras de envío personalizadas.",
  },
  {
    q: "¿Qué pasa cuando necesito escalar?",
    a: "WordPress y WooCommerce escalan sin problema. Cuando tu volumen crezca, ajustamos el hosting y la configuración sin migrar de plataforma.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const TiendasOnline = () => {
  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Tiendas Online y E-commerce en Colombia | ROICAS"
        description="E-commerce con WooCommerce para el mercado colombiano. PSE, Nequi y Bancolombia integrados. Vende mientras duermes. Gestión de inventario y automatización post-venta."
        canonical="https://roicas.com/servicios/tiendas-online"
        schemaJson={tiendasSchema}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6 border border-brand/20">
              <ShoppingCart size={14} />
              Tiendas Online
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tu tienda vende{" "}
              <span className="text-gradient-warm">mientras duermes.</span>{" "}
              La tuya no.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Creamos tiendas online completas y conectadas: pagos, inventario, envíos
              y seguimiento post-venta automatizado. Todo listo para vender desde el primer día.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/cotizar-tienda-online" className="group">
                  Cotizar mi tienda online
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/contacto">Hablar con un experto</Link>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              El 68% de los carritos{" "}
              <span className="text-gradient-warm">se abandonan sin comprar</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Checkout confuso, métodos de pago limitados, sin confianza visual.
              Tus visitantes quieren comprar pero algo los detiene. Nosotros sabemos qué es
              y cómo corregirlo antes de lanzar.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { stat: "68%", desc: "carritos abandonados en promedio" },
                { stat: "3×", desc: "más ventas con checkout optimizado" },
                { stat: "24/7", desc: "tu tienda trabaja sin parar" },
              ].map((item) => (
                <div key={item.stat} className="card-dashboard p-6 text-center">
                  <p className="text-4xl font-black text-brand mb-2">{item.stat}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Más que una tienda,{" "}
              <span className="text-gradient-warm">una máquina de ventas</span>
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

      {/* Includes */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Todo lo que incluye{" "}
                <span className="text-gradient-warm">tu tienda</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Sin módulos de pago adicionales ni sorpresas al final. Un precio,
                una tienda completa.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/cotizar-tienda-online" className="group">
                  Iniciar brief de cotización
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                    <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
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
              ¿Listo para vender online{" "}
              <span className="text-gradient-warm">sin complicaciones?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Responde unas breves preguntas en nuestro brief de 5 pasos y recibe una propuesta
              clara con la plataforma y arquitectura ideal para tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/cotizar-tienda-online" className="group">
                  Cotizar mi tienda online
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/contacto">Hablar con un asesor</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">✓ Sin permanencias · ✓ Presupuesto sin compromiso</p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default TiendasOnline;
