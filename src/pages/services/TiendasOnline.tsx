import * as Tabs from "@radix-ui/react-tabs";
import { ArrowDown, ArrowRight, Check, ChevronDown, Package, CreditCard, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import "./diseno-web.css";
import "./service-pages.css";

const canonical = "/servicios/tiendas-online";
const description = "Creamos tiendas online con WooCommerce en Colombia. Conecta catálogo, pagos, inventario y entregas según la operación de tu negocio.";
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Tiendas online con WooCommerce",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description,
  areaServed: "CO",
  url: `https://roicas.com${canonical}`,
};

const capabilities = [
  {
    id: "catalogo",
    label: "Catálogo",
    icon: Package,
    title: "Productos fáciles de explorar",
    description: "Organizamos colecciones, fichas y variantes. Tu equipo puede actualizar precios, existencias y cupones desde WooCommerce.",
    items: ["Colecciones y fichas","Tallas y variantes","Control de inventario"],
  },
  {
    id: "pagos",
    label: "Pagos y entregas",
    icon: CreditCard,
    title: "Un pedido con condiciones claras",
    description: "Configuramos el carrito, las opciones de entrega y la pasarela acordada. PSE, tarjetas y billeteras dependen de la disponibilidad y requisitos del proveedor.",
    items: ["Carrito y pago","Métodos de entrega","Confirmación del pedido"],
  },
  {
    id: "seguimiento",
    label: "Después de la compra",
    icon: Truck,
    title: "Seguimiento para clientes y equipo",
    description: "Configuramos correos transaccionales y, según el alcance, avisos de envío, recuperación de carritos, reseñas y soporte por WhatsApp.",
    items: ["Correos y avisos","Soporte por WhatsApp","Medición de ventas"],
  },
];

const method = [
  {
    title: "Definimos tu operación",
    description: "Revisamos el catálogo, el tipo de productos y las reglas de pago y entrega.",
    deliverable: "Alcance y requisitos",
  },
  {
    title: "Configuramos y probamos",
    description: "Montamos la tienda y comprobamos una compra de prueba, desde el carrito hasta los avisos del pedido.",
    deliverable: "Vista previa y pruebas",
  },
  {
    title: "Publicamos la tienda",
    description: "Revisamos con tu equipo cómo gestionar pedidos, productos e inventario. Acordamos el seguimiento de ventas y el SEO básico de producto.",
    deliverable: "Tienda publicada y accesos",
  },
];

const faqs = [
  {
    question: "¿Con qué plataforma construyen la tienda?",
    answer: "Usamos WooCommerce sobre WordPress. Revisamos con tu equipo el catálogo, las integraciones y el alojamiento adecuados para el proyecto.",
  },
  {
    question: "¿Puedo vender productos físicos y digitales?",
    answer: "Sí. Podemos configurar productos con envío, descargas digitales o servicios según las necesidades de tu tienda.",
  },
  {
    question: "¿Pueden conectar una transportadora?",
    answer: "Evaluamos opciones como Servientrega, Interrapidísimo y Enví, o una calculadora personalizada. La integración depende de la cobertura, las reglas de envío y los accesos.",
  },
  {
    question: "¿Qué pasa si crece el volumen de pedidos?",
    answer: "Revisamos el número de productos, visitas y pedidos para recomendar ajustes en el alojamiento y la configuración.",
  },
];

export default function TiendasOnline() {
  return (
    <>
      <SeoHead title="Tiendas Online y E-commerce en Colombia | ROICAS" description={description} canonical={canonical}
        schemaJson={serviceSchema} />
      <Header />
      <main id="contenido-principal" className="roicas-web-design roicas-service-page">
        <section className="rwd-hero rsp-hero rsp-service-hero rsp-store-hero" aria-labelledby="service-title">
          <ParticlesBackground particleCount={24} speed={0.22} />
          <div className="section-container rwd-hero-layout rsp-hero-content">
            <div>
              <h1 id="service-title">Diseño de tiendas <span>online en Colombia.</span></h1>
              <p className="rwd-hero-description">Organiza tus productos, recibe pagos y gestiona tus pedidos desde una tienda WooCommerce que se adapta a tu operación.</p>
              <img
                className="rsp-store-mobile-image"
                src="/images/services/tienda-online-mobile.webp"
                alt="Tienda online abierta en una computadora y un teléfono, junto a productos listos para envío"
                width={1080}
                height={1080}
                loading="lazy"
                decoding="async"
              />
              <div className="rwd-actions">
                <Link className="rwd-button rwd-button-light" to="/cotizar-tienda-online">
                  Solicitar propuesta <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a className="rwd-link" href="#alcance">
                  Ver qué incluye <ArrowDown size={17} aria-hidden="true" />
                </a>
              </div>
              <p className="rwd-note">Cuéntanos qué vendes y cómo operas. Revisaremos tu solicitud para preparar la propuesta.</p>
            </div>
          </div>
        </section>

        <section id="alcance" className="rwd-section rwd-technology" aria-labelledby="service-scope">
          <div className="section-container">
            <div className="rwd-section-heading">
              <h2 id="service-scope">El recorrido de una compra</h2>
              <p>De la ficha de producto al pedido entregado, definimos cómo funcionará cada paso para ti y para quien compra.</p>
            </div>
            <Tabs.Root defaultValue={capabilities[0].id} className="rwd-connections">
              <Tabs.List className="rwd-connection-tabs rsp-tabs" aria-label="El recorrido de una compra">
                {capabilities.map(({ id, label, icon: Icon }) => (
                  <Tabs.Trigger className="rwd-connection-tab" key={id} value={id}>
                    <Icon size={19} aria-hidden="true" /> {label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {capabilities.map(({ id, title, description, items }) => (
                <Tabs.Content forceMount className="rwd-connection-panel" key={id} value={id}>
                  <div className="rwd-connection-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ul className="rsp-capabilities">
                    {items.map(item => (
                      <li key={item}><Check size={17} aria-hidden="true" /> {item}</li>
                    ))}
                  </ul>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </section>

        <section id="metodologia" className="rwd-section" aria-labelledby="service-method">
          <div className="section-container">
            <div className="rwd-section-heading"><h2 id="service-method">Cómo trabajamos</h2></div>
            <ol className="rwd-method-grid rsp-method">
              {method.map(({ title, description, deliverable }) => (
                <li className="rwd-method-step" key={title}>
                  <div className="rwd-step-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <p className="rwd-deliverable"><Check size={17} aria-hidden="true" /> <strong>{deliverable}</strong></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rwd-section rsp-faq-section" aria-labelledby="service-faq">
          <div className="section-container rwd-split rwd-faq">
            <div className="rwd-section-heading">
              <h2 id="service-faq">Preguntas frecuentes</h2>
              <ul className="rsp-related" aria-label="Servicios relacionados">
                <li><Link className="rwd-link" to="/servicios/diseno-web">Diseñar un sitio corporativo <ArrowRight size={16} aria-hidden="true" /></Link></li>
                <li><Link className="rwd-link" to="/servicios/automatizacion-ia">Automatizar el seguimiento <ArrowRight size={16} aria-hidden="true" /></Link></li>
              </ul>
            </div>
            <div>
              {faqs.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question} <ChevronDown size={19} aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rwd-section rwd-close" aria-labelledby="service-contact">
          <div className="section-container rwd-close-layout">
            <div>
              <h2 id="service-contact">Cuéntanos cómo vendes</h2>
              <p>Comparte tus productos, pagos y entregas para que podamos preparar una propuesta ajustada a tu tienda.</p>
            </div>
            <div className="rwd-actions">
              <Link className="rwd-button rwd-button-light" to="/cotizar-tienda-online">
                  Solicitar propuesta <ArrowRight size={18} aria-hidden="true" />
                </Link>
              <Link className="rwd-link" to="/contacto">Enviar consulta <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
