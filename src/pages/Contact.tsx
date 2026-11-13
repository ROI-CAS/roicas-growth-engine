import { ArrowDown, ArrowRight, Calendar, CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import "./institutional.css";

const contactInfo = [
  { icon: Mail, title: "Correo", value: "hola@roicas.com", href: "mailto:hola@roicas.com" },
  { icon: Phone, title: "Teléfono", value: "+57 311 456 5403", href: "tel:+573114565403" },
  { icon: MapPin, title: "Ubicación", value: "Bogotá, Colombia" },
  { icon: Clock, title: "Horario", value: "Lunes a viernes, 9:00 a. m. a 6:00 p. m." },
];

export default function Contact() {
  const { openBooking } = useBooking();

  const book = () => {
    trackCtaClicked("Agendar consultoría", "contacto");
    openBooking();
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Contacto | Agenda una consultoría gratuita | ROICAS" description="Agenda una consultoría gratuita de 20 minutos o solicita que te contactemos por WhatsApp para conversar sobre tu proyecto." canonical="https://roicas.com/contacto" />
      <Header />
      <main id="contenido-principal" className="roicas-institutional">
        <section className="ri-hero ri-contact-hero" aria-labelledby="contact-page-title">
          <ParticlesBackground particleCount={24} speed={0.2} className="opacity-50" />
          <div className="section-container ri-hero-layout">
            <div className="ri-enter">
              <h1 id="contact-page-title">Hablemos de <span>tu proyecto</span></h1>
              <p className="ri-hero-lead">Agenda una videollamada gratuita de 20 minutos para revisar tus necesidades o déjanos tus datos para conversar por WhatsApp.</p>
              <div className="ri-actions">
                <button type="button" onClick={book} className="ri-button ri-button-light"><Calendar size={19} aria-hidden="true" /> Agendar consultoría <ArrowRight size={18} aria-hidden="true" /></button>
                <a href="#solicitud-contacto" className="ri-link">Solicitar contacto <ArrowDown size={18} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="solicitud-contacto" className="ri-section ri-paper" aria-labelledby="contact-request-title">
          <div className="section-container ri-split ri-contact-layout">
            <div className="ri-contact-sidebar">
              <div className="ri-copy">
                <h2 id="contact-request-title">Solicita que te contactemos</h2>
                <p>Completa el formulario para que podamos escribirte por WhatsApp.</p>
              </div>
              <aside className="ri-contact-review" aria-labelledby="contact-review-title">
                <h3 id="contact-review-title">Qué revisamos en la llamada</h3>
                <ul>
                  <li><CheckCircle2 size={18} aria-hidden="true" /><span>Qué quieres lograr y cómo llegan hoy tus clientes.</span></li>
                  <li><CheckCircle2 size={18} aria-hidden="true" /><span>Qué vale la pena revisar primero en tu web, tus campañas o el seguimiento.</span></li>
                  <li><CheckCircle2 size={18} aria-hidden="true" /><span>Qué información necesitamos para preparar una propuesta.</span></li>
                </ul>
              </aside>
              <dl className="ri-contact-details">
                {contactInfo.map(({ title, value, href, icon: Icon }) => (
                  <div key={title} className="ri-contact-row">
                    <span className="ri-icon"><Icon size={19} aria-hidden="true" /></span>
                    <div><dt>{title}</dt><dd>{href ? <a href={href}>{value}</a> : value}</dd></div>
                  </div>
                ))}
              </dl>
            </div>
            <ContactForm variant="full" showTitle={false} className="ri-contact-form" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
