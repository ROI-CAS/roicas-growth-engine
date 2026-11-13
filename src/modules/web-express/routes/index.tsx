import { CampaignNotice } from "@/modules/web-express/components/BlackNovemberLanding";
import { useCampaignClock } from "@/modules/web-express/lib/campaign-server";
import {
  PlanIncludes,
  PlanSteps,
  PlanPricing,
  PlanFAQ,
  PlanFooter,
} from "@/modules/web-express/components/PlanSections";
import { BusinessPresence } from "@/modules/web-express/components/BusinessPresence";
import { DesignShowcase } from "@/modules/web-express/components/DesignShowcase";
import { useMobileChrome } from "@/modules/web-express/hooks/use-mobile-chrome";

import { useState, useEffect } from "react";
import { Button } from "@/modules/web-express/components/ui/button";
import { Toaster } from "@/modules/web-express/components/ui/sonner";
import { BriefModal } from "@/modules/web-express/components/BriefModal";
import { BookingModal } from "@/modules/web-express/components/BookingModal";
import { ExpressBrief } from "@/modules/web-express/components/ExpressBrief";
import { WhatsAppIcon } from "@/modules/web-express/components/WhatsAppIcon";
import { HeroCleanAgency } from "@/modules/web-express/components/HeroCleanAgency";
import { Reveal } from "@/modules/web-express/components/Reveal";
import { track, trackScrollDepth } from "@/modules/web-express/lib/meta";
import { PRICE_TOTAL_COP, PRICE_DEPOSIT_LABEL } from "@/modules/web-express/lib/site";
import { Zap, Globe, Smartphone as Responsive, Shield, X } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "¿Qué recibo en 24 horas hábiles?",
    a: "Desde que recibimos tu brief completo, preparamos la propuesta de tu página en 24 horas hábiles para tu revisión. Los ajustes incluidos, la aprobación y el pago del saldo preceden a la publicación final.",
  },
  {
    q: "¿Cuándo comienzan a contar las 24 horas?",
    a: "Las 24 horas hábiles comienzan a contar en el momento exacto en que recibimos toda la información necesaria del brief (datos de contacto, servicios y contenido que desees incluir). Los fines de semana y festivos no cuentan como horas hábiles.",
  },
  {
    q: "¿Cómo pueden entregar una página profesional en solo 24 horas?",
    a: "Web Express tiene un alcance definido y un proceso optimizado. El brief nos permite eliminar reuniones y tiempos muertos, mientras que la tecnología, automatización e inteligencia artificial aceleran diferentes etapas del trabajo. Antes de entregar, nuestro equipo realiza un control de calidad de la página. 24 horas no significa improvisar: significa trabajar con un sistema diseñado para hacerlo más eficiente.",
  },
  {
    q: "¿Utilizan inteligencia artificial para crear las páginas?",
    a: "Sí. Utilizamos inteligencia artificial y tecnología moderna para trabajar de forma más eficiente y acelerar parte del proceso. Pero no publicamos resultados automáticos sin revisión. Cada Web Express se adapta al negocio y pasa por control de calidad antes de ser entregada. La tecnología nos ayuda a trabajar más rápido; el criterio y la revisión siguen siendo parte del proceso.",
  },
  {
    q: "¿Qué información necesito enviar?",
    a: "Solo la información básica de tu negocio: nombre, datos de contacto, descripción de tus servicios principales y tu logo o fotos si los tienes. Si no tienes fotos profesionales o logo en alta calidad, nosotros te ayudamos a integrar imágenes libres de derechos adecuadas para tu sector.",
  },
  {
    q: "¿El dominio y el hosting están incluidos?",
    a: "Sí. El primer año de dominio .com propio y hosting de alta velocidad con certificado SSL (candado de seguridad HTTPS) están 100% incluidos en el precio total de $490.000.",
  },
  {
    q: "¿Puedo usar mi dominio actual si ya tengo uno?",
    a: "Sí, claro. Si ya compraste un dominio previamente, nosotros te ayudamos a conectarlo a tu nueva página web sin costo adicional.",
  },
  {
    q: "¿Puedo pedir cambios o ajustes después de la entrega?",
    a: "Sí. Incluimos una (1) ronda de ajustes sin costo adicional después de entregarte la propuesta inicial (ajustes de textos, imágenes, colores o datos de contacto). Si requieres cambios posteriores o nuevas secciones en el futuro, se cotizan de forma transparente.",
  },
  {
    q: "¿Qué pasa después del primer año con el hosting y dominio?",
    a: "A partir del segundo año, la renovación de tu hosting y dominio la realizas directamente con el proveedor al costo vigente real del mercado, sin intermediarios ni cobros ocultos de nuestra parte.",
  },
  {
    q: "¿Qué pasa si necesito más de 5 secciones o una tienda online?",
    a: "Web Express 24H está optimizado específicamente para sitios one-page de alta conversión de hasta 5 secciones. Si tu proyecto requiere una tienda virtual compleja, catálogo masivo o múltiples páginas, podemos cotizarte un desarrollo a la medida a través de Roicas.",
  },
  {
    q: "¿Cómo funciona el pago en dos partes?",
    a: `Pagas el 50% (${PRICE_DEPOSIT_LABEL}) para iniciar el diseño de tu web. El 50% restante (${PRICE_DEPOSIT_LABEL}) lo pagas únicamente cuando revises y apruebes la página web terminada, antes de publicarla en tu dominio. Aceptamos PSE, Nequi, Bancolombia y tarjetas de crédito o débito mediante Wompi.`,
  },
  {
    q: "¿Qué ocurre si no cumplen con el plazo acordado?",
    a: "Cumplir el plazo es parte de nuestra promesa. Si no entregamos dentro del plazo acordado por una causa atribuible a nosotros, podrás cancelar el servicio y solicitar la devolución del anticipo, de acuerdo con nuestros términos y condiciones.",
  },
  {
    q: "¿La página funciona bien en celulares?",
    a: "Sí. Diseñamos y revisamos tu página para que se adapte a celulares, tablets y computadores, con contenido legible y botones fáciles de usar.",
  },
  {
    q: "¿La página es 100% mía una vez pagada?",
    a: "Sí. Una vez completado el pago total, el sitio web, su dominio y su contenido son 100% de tu propiedad.",
  },
];

export default function Landing() {
  const campaignState = useCampaignClock();
  const chrome = useMobileChrome();
  const [briefOpen, setBriefOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // ViewContent al 50% de scroll — señal de interés real.
  useEffect(() => trackScrollDepth(0.5), []);

  const openBrief = () => {
    const solicitarElem = document.getElementById("solicitar");
    if (solicitarElem) {
      solicitarElem.scrollIntoView({ behavior: "smooth" });
    } else {
      setBriefOpen(true);
    }
  };

  const openBooking = () => setBookingOpen(true);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/20">
      <Nav onCta={openBrief} onBooking={openBooking} mobileHidden={chrome.hidden} />
      <CampaignNotice serverNow={campaignState.serverNow} />
      <HeroCleanAgency onCta={openBrief} onBooking={openBooking} />
      <DesignShowcase onCta={openBrief} />
      <TrustBar />
      <BusinessPresence />
      <PlanIncludes />
      <PlanSteps />
      <PlanPricing onCta={openBrief} onBooking={openBooking} />
      <PlanFAQ items={FAQ_ITEMS} />
      <ExpressBrief onBookingClick={openBooking} />
      <PlanFooter />
      <BriefModal open={briefOpen} onOpenChange={setBriefOpen} />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <FloatingWhatsApp
        hidden={
          chrome.heroVisible ||
          chrome.formVisible ||
          chrome.inlineActionVisible ||
          chrome.hidden ||
          briefOpen ||
          bookingOpen
        }
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}

/* ---------------- 1. Navigation Bar ---------------- */
function Nav({
  mobileHidden,
  onCta,
  onBooking,
  onWhatsapp,
}: {
  mobileHidden: boolean;
  onCta: () => void;
  onBooking: () => void;
  onWhatsapp?: () => void;
}) {
  return (
    <nav
      aria-label="Navegación principal"
      inert={mobileHidden ? "" : undefined}
      data-scroll-hidden={mobileHidden}
      className="express-nav sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 text-slate-900 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 min-w-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ed1733] text-white shadow-sm shadow-red-500/25">
            <Zap className="size-5 fill-current" aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold tracking-tight leading-none">
              Web Express <span className="text-[#ed1733]">24H</span>
            </span>
            <span className="text-[10px] leading-none text-slate-500">by Roicas</span>
          </span>
        </a>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#disenos" className="nav-underline hover:text-[#ed1733] transition-colors">
            Ejemplos
          </a>
          <a href="#incluye" className="nav-underline hover:text-[#ed1733] transition-colors">
            Qué incluye
          </a>
          <a href="#proceso" className="nav-underline hover:text-[#ed1733] transition-colors">
            Cómo funciona
          </a>
          <a href="#garantia" className="nav-underline hover:text-[#ed1733] transition-colors">
            Garantía
          </a>
          <a href="#precio" className="nav-underline hover:text-[#ed1733] transition-colors">
            Precio
          </a>
          <a href="#faq" className="nav-underline hover:text-[#ed1733] transition-colors">
            FAQ
          </a>
        </div>

        {/* Right-side CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={onCta}
            className="sheen h-9 sm:h-10 px-4 sm:px-6 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-xs sm:text-sm"
          >
            Solicitar mi web
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ---------------- 2. Trust Bar / Beneficios Rápidos ---------------- */
function TrustBar() {
  const items = [
    {
      icon: Zap,
      title: "Propuesta en 24 horas hábiles",
      desc: "Desde que envías el brief completo",
    },
    {
      icon: Globe,
      title: "Dominio .com + Hosting",
      desc: "Incluidos el primer año con SSL",
    },
    {
      icon: Responsive,
      title: "Optimizada para celular",
      desc: "Texto legible y contacto fácil en cada pantalla",
    },
    {
      icon: Shield,
      title: `Solo 50% (${PRICE_DEPOSIT_LABEL})`,
      desc: "El resto al aprobar tu página web",
    },
  ];

  return (
    <section
      className="express-trust border-y border-border/80 bg-muted/30 py-6 sm:py-8"
      aria-label="Beneficios del plan"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={i}
                delay={i * 40}
                className="express-trust-item flex items-center gap-3.5 text-left"
              >
                <div className="size-11 rounded-2xl bg-brand/10 text-brand grid place-items-center shrink-0 shadow-sm">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5. Qué incluye / Lo que recibe el cliente ---------------- */
function FloatingWhatsApp({ hidden }: { hidden: boolean }) {
  const [pillOpen, setPillOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("wa-pill-dismissed")) return;
    } catch {
      /* sessionStorage no disponible */
    }
    const showT = setTimeout(() => setPillOpen(true), 4000);
    const hideT = setTimeout(() => setPillOpen(false), 14000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  const dismissPill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPillOpen(false);
    try {
      sessionStorage.setItem("wa-pill-dismissed", "1");
    } catch {
      /* noop */
    }
  };

  const handleClick = () => {
    track("Contact");
    const text = encodeURIComponent(
      "Hola Web Express 24H, quiero información para tener mi página web profesional en 24 horas.",
    );
    window.open(`https://wa.me/573114565403?text=${text}`, "_blank");
  };

  return (
    <div
      inert={hidden ? "" : undefined}
      data-scroll-hidden={hidden}
      className="express-floating-whatsapp fixed bottom-16 sm:bottom-18 right-5 sm:right-6 z-50 flex items-center gap-3"
    >
      {/* Nudge proactivo */}
      <div
        className={`hidden sm:flex items-center gap-1 pl-4 pr-2 py-2.5 rounded-full bg-background/95 backdrop-blur-md border border-emerald-500/40 text-xs font-semibold text-foreground shadow-2xl shadow-emerald-500/10 transition-all duration-500 ease-out ${
          pillOpen
            ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }`}
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-2 cursor-pointer group focus-visible:outline-none"
        >
          <span className="relative flex size-2.5">
            <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
          </span>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            ¿Dudas?{" "}
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
              Conversemos sobre tu web
            </strong>
          </span>
        </button>
        <button
          onClick={dismissPill}
          aria-label="Cerrar mensaje"
          className="size-5 grid place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
        >
          <X className="size-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Floating Button */}
      <button
        onClick={handleClick}
        aria-label="Contactar por WhatsApp instantáneamente"
        className="relative size-13 sm:size-14 rounded-full bg-[#087a48] hover:bg-[#06693e] text-white grid place-items-center shadow-2xl shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40"
      >
        <WhatsAppIcon className="size-6 sm:size-7 relative z-10" />
      </button>
    </div>
  );
}

/* ---------------- 16. Footer ---------------- */

