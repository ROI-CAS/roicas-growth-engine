import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { 
  ChevronDown, 
  MessageCircle, 
  Calendar, 
  ShieldQuestion
} from "lucide-react";
import { homeFaqs } from "@/lib/homeFaqs";
import { trackFaqOpened, trackCtaClicked } from "@/lib/analytics";
import { useBooking } from "@/contexts/BookingContext";
import ParticlesBackground from "./ui/ParticlesBackground";
import "./faq-accordion.css";

export default function FAQSection() {
  const { openBooking } = useBooking();
  const [openItem, setOpenItem] = useState<string | undefined>("0");

  const handleValueChange = (value: string) => {
    setOpenItem(value);
    if (value) {
      const idx = Number(value);
      const faq = homeFaqs[idx];
      if (faq) {
        trackFaqOpened(faq.question, idx);
      }
    }
  };

  return (
    <section id="preguntas-frecuentes" className="roicas-faq-section relative overflow-hidden" aria-labelledby="faq-main-title">
      <ParticlesBackground particleCount={25} speed={0.2} className="opacity-50 z-0" />
      <div className="rfq-inner relative z-10">
        <div className="rfq-layout">
          
          {/* Columna Lateral Informativa */}
          <aside className="rfq-sidebar">
            <span className="rfq-eyebrow">
              <ShieldQuestion size={16} aria-hidden="true" />
              Respuestas Claras · Cero Fricción
            </span>
            <h2 id="faq-main-title">
              Todo lo que necesitas saber<br />
              <span>antes de dar el paso.</span>
            </h2>
            <p className="rfq-desc">
              Si tu empresa necesita una web nueva, posicionamiento orgánico o automatización de contactos, 
              aquí resolvemos cómo trabajamos, quién es el dueño del proyecto y qué esperar en cada etapa.
            </p>

            {/* Tarjeta de Contacto Directo */}
            <div className="rfq-help-card">
              <h4>
                <MessageCircle size={18} className="text-emerald-700" aria-hidden="true" />
                ¿Tienes una duda puntual?
              </h4>
              <p>
                Conversa directamente con nuestro equipo por WhatsApp o agenda una sesión de 20 minutos sin compromiso.
              </p>
              <div className="rfq-help-actions">
                <a 
                  href="https://wa.me/573114565403?text=Hola%20Roicas%2C%20tengo%20una%20pregunta%20sobre%20sus%20servicios" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rfq-help-btn-wa"
                  onClick={() => trackCtaClicked("WhatsApp FAQ Sidebar", "faq")}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  <span>Preguntar por WhatsApp</span>
                </a>
                <button 
                  type="button" 
                  className="rfq-help-btn-calendar"
                  onClick={() => {
                    trackCtaClicked("Agendar consultoría FAQ", "faq");
                    openBooking();
                  }}
                >
                  <Calendar size={16} aria-hidden="true" />
                  <span>Agendar consultoría</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Columna de Acordeón */}
          <div className="rfq-content">
            {/* Acordeón Radix */}
            <AccordionPrimitive.Root
              type="single"
              collapsible
              value={openItem}
              onValueChange={handleValueChange}
              className="rfq-accordion-root"
            >
              {homeFaqs.map((faq, idx) => {
                const valueStr = String(idx);

                return (
                  <AccordionPrimitive.Item
                    key={faq.question}
                    value={valueStr}
                    className="rfq-accordion-card"
                  >
                    <AccordionPrimitive.Header className="flex">
                      <AccordionPrimitive.Trigger className="rfq-trigger">
                        <div className="rfq-question-wrapper">
                          <span className="rfq-question-text">{faq.question}</span>
                        </div>
                        <span className="rfq-chevron" aria-hidden="true">
                          <ChevronDown size={18} />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>

                    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <div className="rfq-content-body">
                        {faq.answer}
                      </div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                );
              })}
            </AccordionPrimitive.Root>

          </div>

        </div>
      </div>
    </section>
  );
}
