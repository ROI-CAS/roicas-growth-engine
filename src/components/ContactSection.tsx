import { 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles,
  PhoneCall,
  Search,
  Headphones
} from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { trackCtaClicked } from "@/lib/analytics";
import ContactForm from "./ContactForm";
import ParticlesBackground from "./ui/ParticlesBackground";
import "./contact-hub.css";

const sessionBenefits = [
  {
    title: "Revisión de tus prioridades",
    desc: "Hablamos de cómo llegan tus clientes y qué canal conviene trabajar primero."
  },
  {
    title: "Un punto de partida concreto",
    desc: "Identificamos qué vale la pena revisar en tu web, tu visibilidad y tus vías de contacto."
  },
  {
    title: "Alcance por escrito",
    desc: "Si avanzamos, la propuesta detalla los entregables, el plazo y el precio."
  }
];

export default function ContactSection() {
  const { openBooking } = useBooking();

  return (
    <section id="contacto" aria-labelledby="contact-main-heading" className="roicas-contact-hub relative overflow-hidden">
      <ParticlesBackground particleCount={30} speed={0.25} className="opacity-50 z-0" />
      <div className="rch-inner relative z-10">
        
        {/* Encabezado Principal */}
        <div className="rch-header">
          <span className="rch-eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Empieza Hoy Mismo · Dos Caminos
          </span>
          <h2 id="contact-main-heading">
            ¿Listo para que tu web y tu marketing<br />
            <span>trabajen conectados?</span>
          </h2>
          <p className="rch-intro">
            Elige el formato que más te convenga: agenda una sesión directa de 20 minutos en nuestro calendario 
            o déjanos tus datos para coordinar por WhatsApp.
          </p>
        </div>

        {/* Grid Dual de Conversión */}
        <div className="rch-grid">
          
          {/* Card 1: Agendamiento Inmediato en Calendario */}
          <div className="rch-card rch-card-booking">
            <span className="rch-card-tag">
              <Calendar size={13} aria-hidden="true" />
              Videollamada · 20 minutos
            </span>

            <h3>Agenda tu consultoría de 20 minutos</h3>
            <p className="rch-card-desc">
              Selecciona el día y la hora que mejor se adapte a tu agenda. 
              La sesión es 100% gratuita y la realizamos por videollamada.
            </p>

            <ul className="rch-benefits-list" aria-label="Qué incluye la consultoría">
              {sessionBenefits.map((b) => (
                <li key={b.title} className="rch-benefit-item">
                  <CheckCircle2 size={17} className="rch-benefit-icon" aria-hidden="true" />
                  <div>
                    <strong>{b.title}</strong>
                    <div style={{ color: "#a59fa9", fontSize: "13px", marginTop: "2px" }}>{b.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rch-booking-actions">
              <button 
                type="button" 
                onClick={() => {
                  trackCtaClicked("Agendar consultoría ContactHub", "contacto");
                  openBooking();
                }}
                className="rch-btn-calendar"
              >
                <Calendar size={18} aria-hidden="true" />
                <span>Agendar consultoría</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <a 
                href="https://wa.me/573114565403?text=Hola%20Roicas%2C%20quiero%20conocer%20m%C3%A1s%20sobre%20sus%20servicios%20de%20desarrollo%20y%20marketing"
                target="_blank" 
                rel="noopener noreferrer"
                className="rch-wa-link"
                onClick={() => trackCtaClicked("WhatsApp ContactHub Link", "contacto")}
              >
                <MessageCircle size={16} aria-hidden="true" />
                <span>¿Prefieres escribir directo? Abrir chat de WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Formulario Asíncrono */}
          <div className="rch-card rch-card-form">
            <span className="rch-card-tag" style={{ background: "rgba(255,255,255,0.08)", color: "#e5e0e8" }}>
              <Clock size={13} aria-hidden="true" />
              Contacto por WhatsApp
            </span>

            <h3>Prefiero que me contacten</h3>
            <p className="rch-form-desc">
              Déjanos tu nombre y WhatsApp para que podamos contactarte y coordinar el siguiente paso.
            </p>

            <ContactForm 
              variant="full" 
              showTitle={false} 
              className="rch-actual-form" 
            />
          </div>

        </div>

      </div>
    </section>
  );
}
