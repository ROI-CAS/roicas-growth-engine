import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Menu, X, ChevronDown, Globe, ShoppingCart, Search, Megaphone, Bot, ArrowRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import logo from "@/assets/logo-roicas.webp";
import { publishedArticles } from "@/lib/blog";
import "./site-navigation.css";

const serviceGroups = [
  { title: "Web y tiendas", items: [
    { href: "/servicios/diseno-web", label: "Diseño web", description: "Sitios corporativos a la medida", icon: Globe },
    { href: "/servicios/tiendas-online", label: "Tiendas online", description: "Tu operación de venta digital", icon: ShoppingCart },
  ] },
  { title: "Captación y automatización", items: [
    { href: "/servicios/seo", label: "SEO", description: "Visibilidad en buscadores", icon: Search },
    { href: "/servicios/publicidad-digital", label: "Publicidad digital", description: "Campañas de Google y Meta", icon: Megaphone },
    { href: "/servicios/automatizacion-ia", label: "Automatización con IA", description: "WhatsApp, seguimiento y CRM", icon: Bot },
  ] },
];
const focusStyle = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const navLink = `roicas-nav-link inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-foreground hover:text-brand ${focusStyle}`;

function ServiceGroups({ onNavigate }: { onNavigate: () => void }) {
  return <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
    {serviceGroups.map((group) => <div key={group.title}>
      <h3 className="mb-2 px-3 text-sm font-semibold text-foreground">{group.title}</h3>
      <ul className="space-y-1">
        {group.items.map((item) => <li key={item.href}>
          <NavLink to={item.href} end onClick={onNavigate} className={`roicas-service-link flex min-h-12 items-start gap-3 rounded-lg p-3 hover:bg-accent ${focusStyle}`}>
            <item.icon size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
            <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">{item.label}</span><span className="mt-1 block text-sm leading-snug text-muted-foreground">{item.description}</span></span>
          </NavLink>
        </li>)}
      </ul>
    </div>)}
  </div>;
}

const Header = () => {
  const { openBooking } = useBooking();
  const { pathname } = useLocation();
  const servicesActive = pathname === "/servicios" || pathname.startsWith("/servicios/");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const serviceButton = useRef<HTMLButtonElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const mobileServiceButton = useRef<HTMLButtonElement>(null);
  const desktopDisclosure = useRef<HTMLDivElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const id = useId();
  const servicesId = `${id}-services`;
  const mobileId = `${id}-mobile`;
  const mobileServicesId = `${id}-mobile-services`;

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!desktopDisclosure.current?.contains(event.target as Node)) setServicesOpen(false);
      if (!mobilePanel.current?.contains(event.target as Node) && !mobileButton.current?.contains(event.target as Node)) {
        setMobileOpen(false);
        setMobileServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  const closeMenus = () => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById("contenido-principal") ?? document.querySelector("main");
    if (!main) return;
    event.preventDefault();
    closeMenus();
    if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
    main.focus({ preventScroll: true });
    main.scrollIntoView();
  };

  return (
    <header className="roicas-site-header fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
      <a href="#contenido-principal" className="roicas-skip-link" onClick={skipToContent}>Saltar al contenido principal</a>
      <div className="section-container">
        <div className="flex h-16 items-center justify-between gap-2 lg:h-20 lg:gap-5">
          <NavLink to="/" end className={`shrink-0 rounded-lg ${focusStyle}`} aria-label="ROICAS, inicio">
            <img src={logo} alt="ROICAS" className="h-8 w-auto sm:h-10" />
          </NavLink>
          <nav aria-label="Navegación principal" className="hidden items-center gap-3 lg:flex">
            <NavLink to="/" end className={navLink}>Inicio</NavLink>
            <div ref={desktopDisclosure}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setServicesOpen(false); }}
              onKeyDown={(event) => { if (event.key === "Escape" && servicesOpen) { event.preventDefault(); setServicesOpen(false); serviceButton.current?.focus(); } }}
            >
              <button ref={serviceButton} type="button" className={`${navLink} gap-1`} data-section-active={servicesActive || undefined} aria-expanded={servicesOpen} aria-controls={servicesId} onClick={() => setServicesOpen((value) => !value)}>
                Servicios<ChevronDown size={16} aria-hidden="true" className={servicesOpen ? "rotate-180" : ""} />
              </button>
              <div id={servicesId} hidden={!servicesOpen} className="roicas-service-menu fixed inset-x-4 top-20 mx-auto max-h-[75dvh] max-w-3xl overflow-y-auto rounded-xl border border-border bg-background p-5 shadow-xl">
                <NavLink to="/servicios" end onClick={closeMenus} className={`roicas-service-menu-all mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-brand ${focusStyle}`}>Ver todos los servicios <ArrowRight size={16} aria-hidden="true" /></NavLink>
                <ServiceGroups onNavigate={closeMenus} />
              </div>
            </div>
            {publishedArticles.length > 0 && <NavLink to="/blog" className={navLink}>Blog</NavLink>}
            <NavLink to="/nosotros" className={navLink}>Nosotros</NavLink>
            <NavLink to="/contacto" className={navLink}>Contacto</NavLink>
          </nav>
          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="hero" onClick={() => { closeMenus(); openBooking(); }} className="h-11 px-3 text-xs sm:px-4 sm:text-sm">Agendar consultoría</Button>
            <button ref={mobileButton} type="button" className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-accent lg:hidden ${focusStyle}`}
              aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={mobileOpen} aria-controls={mobileId}
              onClick={() => { setMobileOpen((value) => !value); setMobileServicesOpen(false); }}
              onKeyDown={(event) => { if (event.key === "Escape") { closeMenus(); mobileButton.current?.focus(); } }}
            >{mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}</button>
          </div>
        </div>
        <div ref={mobilePanel} id={mobileId} hidden={!mobileOpen}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background py-3 lg:hidden"
          onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeMenus(); mobileButton.current?.focus(); } }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node) && !mobileButton.current?.contains(event.relatedTarget as Node)) { setMobileOpen(false); setMobileServicesOpen(false); } }}
        >
          <nav aria-label="Navegación móvil" className="space-y-1 pb-3">
            <NavLink to="/" end onClick={closeMenus} className={`flex ${navLink}`}>Inicio</NavLink>
            <div onKeyDown={(event) => {
              if (event.key === "Escape" && mobileServicesOpen) {
                event.preventDefault();
                event.stopPropagation();
                setMobileServicesOpen(false);
                mobileServiceButton.current?.focus();
              }
            }}>
              <button ref={mobileServiceButton} type="button" data-section-active={servicesActive || undefined} aria-expanded={mobileServicesOpen} aria-controls={mobileServicesId} onClick={() => setMobileServicesOpen((value) => !value)} className={`flex w-full justify-between ${navLink}`}>
                Servicios<ChevronDown size={18} aria-hidden="true" className={mobileServicesOpen ? "rotate-180" : ""} />
              </button>
              <div id={mobileServicesId} hidden={!mobileServicesOpen} className="px-1 py-3">
                <NavLink to="/servicios" end onClick={closeMenus} className={`roicas-service-menu-all mb-3 flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-brand ${focusStyle}`}>Ver todos los servicios <ArrowRight size={16} aria-hidden="true" /></NavLink>
                <ServiceGroups onNavigate={closeMenus} />
              </div>
            </div>
            {publishedArticles.length > 0 && <NavLink to="/blog" onClick={closeMenus} className={`flex ${navLink}`}>Blog</NavLink>}
            <NavLink to="/nosotros" onClick={closeMenus} className={`flex ${navLink}`}>Nosotros</NavLink>
            <NavLink to="/contacto" onClick={closeMenus} className={`flex ${navLink}`}>Contacto</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;

