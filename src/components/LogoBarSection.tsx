import { ShieldCheck, Zap, MessageCircle, Lock } from "lucide-react";
import falconCloud from "@/assets/clients/falcon-cloud.png";
import findolor from "@/assets/clients/findolor.png";
import componenteLegal from "@/assets/clients/componente-legal.png";
import ecosfera from "@/assets/clients/ecosfera.png";
import torregroza from "@/assets/clients/torregroza-diazgranados.png";
import aeroAmbulancias from "@/assets/clients/aero-ambulancias.jpg";
import "./client-strip.css";

const clientLogos = [
  { src: falconCloud, alt: "Falcon Cloud", name: "Falcon Cloud" },
  { src: findolor, alt: "FinDolor", name: "FinDolor" },
  { src: componenteLegal, alt: "Componente Legal", name: "Componente Legal" },
  { src: ecosfera, alt: "Ecosfera", name: "Ecosfera" },
  { src: torregroza, alt: "Torregroza & Diazgranados", name: "Torregroza" },
  { src: aeroAmbulancias, alt: "Aero Ambulancias", name: "Aero Ambulancias" },
];

const guarantees = [
  {
    icon: Lock,
    title: "Sitio 100% tuyo",
    desc: "Dominio, hosting y código a tu nombre. Sin contratos de amarre.",
  },
  {
    icon: Zap,
    title: "Carga rápida en móvil",
    desc: "Diseño ligero que carga en segundos en cualquier conexión.",
  },
  {
    icon: MessageCircle,
    title: "Listo para vender",
    desc: "Formularios y WhatsApp conectados para responder cotizaciones rápido.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía y soporte",
    desc: "Acompañamiento directo con el equipo que desarrolló tu web.",
  },
];

export default function LogoBarSection() {
  return (
    <section className="roicas-trust-strip" aria-label="Confianza y garantías Roicas">
      <div className="rts-inner">
        {/* Título sutil de respaldo */}
        <p className="rts-heading">
          Empresas que confían en Roicas para su presencia web y captación de clientes
        </p>

        {/* Tira fluida de logos */}
        <div className="rts-logos-track" role="list">
          {clientLogos.map((client) => (
            <div key={client.name} className="rts-logo-item" role="listitem">
              <img
                src={client.src}
                alt={client.alt}
                className="rts-logo-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        {/* Tira horizontal de garantías (sin números densos ni tecnicismos) */}
        <div className="rts-guarantees-grid">
          {guarantees.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rts-guarantee-pill">
              <div className="rts-guarantee-icon">
                <Icon size={16} aria-hidden="true" />
              </div>
              <div className="rts-guarantee-text">
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
