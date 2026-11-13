import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/modules/diagnostico/components/ui/button";
import { scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackNavCTA } from "@/modules/diagnostico/lib/pixel";
import { cn } from "@/lib/utils";

const links = [
  { label: "Diagnóstico", id: "checkup" },
  { label: "Servicios", id: "servicios" },
  { label: "Paquetes", id: "paquetes" },
  { label: "Agendar", id: "agenda" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const goingDown = y > lastY;
      if (y > 120 && goingDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      {/* Skip navigation — visible solo al focus, para teclado y lectores de pantalla */}
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground"
      >
        Saltar al contenido principal
      </a>
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/85 backdrop-blur-md border-b border-border/60 shadow-soft"
          : "bg-transparent",
        hidden && !open && "-translate-y-full md:translate-y-0"
      )}
      aria-label="Barra principal"
    >
      <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
        <a
          href="#inicio"
          aria-label="ROICAS logo — Ir al inicio"
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            handleNav("inicio");
          }}
        >
          <img
            src="/products/diagnostico/logo-roicas.webp"
            alt="ROICAS logo"
            className="h-8 w-auto md:h-10"
            loading="eager"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => handleNav(l.id)}
              className="story-link cursor-pointer text-sm font-medium text-ink-soft hover:text-ink"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button onClick={() => { trackNavCTA("navbar_quiero_web"); handleNav("contacto"); }} size="default">
            Solicitar diagnóstico
          </Button>
        </div>

        <button
          className="md:hidden inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="diagnostic-mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div id="diagnostic-mobile-menu" className="md:hidden border-t border-border bg-cream animate-fade-in">
          <div className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                className="cursor-pointer rounded-lg px-3 py-3 text-left text-base font-medium text-ink hover:bg-secondary"
              >
                {l.label}
              </button>
            ))}
            <Button
              onClick={() => { trackNavCTA("navbar_mobile_quiero_web"); handleNav("contacto"); }}
              variant="brand"
              className="mt-2"
            >
              Solicitar diagnóstico
            </Button>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
