import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, ShoppingCart, Search, Megaphone, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-web-roicas.webp";
import logoLight from "@/assets/logo-roicas.webp";

const serviceItems = [
  {
    href: "/servicios/diseno-web",
    label: "Diseño Web",
    description: "Sitios WordPress de alta conversión",
    icon: Globe,
    bg: "bg-blue-500",
  },
  {
    href: "/servicios/tiendas-online",
    label: "Tiendas Online",
    description: "E-commerce que vende mientras duermes",
    icon: ShoppingCart,
    bg: "bg-emerald-500",
  },
  {
    href: "/servicios/seo",
    label: "SEO",
    description: "Posicionamiento orgánico sostenible",
    icon: Search,
    bg: "bg-amber-500",
  },
  {
    href: "/servicios/publicidad-digital",
    label: "Publicidad Digital",
    description: "Google Ads y Meta Ads con ROI medible",
    icon: Megaphone,
    bg: "bg-rose-500",
  },
  {
    href: "/servicios/automatizacion-ia",
    label: "Automatización con IA",
    description: "Flujos inteligentes y bots que convierten",
    icon: Bot,
    bg: "bg-violet-500",
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  // Dark hero only on home page when not scrolled
  const isDarkHero = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) setMobileServicesOpen(false);
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : isDarkHero
          ? "bg-transparent border-b border-transparent"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={isDarkHero ? logoDark : logoLight} alt="ROICAS" className="h-9 md:h-11 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className={`text-sm font-medium transition-colors relative group ${isDarkHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>

            {/* Servicios dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors relative group ${isDarkHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>
                Servicios
                <motion.span
                  animate={{ rotate: servicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-background border border-border rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {serviceItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                            <item.icon size={14} className="text-white" strokeWidth={2.2} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-tight">{item.label}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-border bg-muted/30">
                      <a href="/servicios" className="text-xs font-medium text-primary hover:underline">
                        Ver todos los servicios →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/nosotros"
              className={`text-sm font-medium transition-colors relative group ${isDarkHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="/contacto"
              className={`text-sm font-medium transition-colors relative group ${isDarkHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="default" size="default" className="rounded-full px-6 font-semibold" asChild>
              <a href="/contacto">Quiero mi web</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-background border-t border-border"
            >
              <div className="py-4 space-y-1">
                <a
                  href="/"
                  className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </a>

                {/* Mobile Servicios accordion */}
                <div>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    Servicios
                    <motion.span
                      animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-3 mt-1 space-y-1"
                      >
                        {serviceItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className={`w-5 h-5 rounded ${item.bg} flex items-center justify-center shrink-0`}>
                              <item.icon size={11} className="text-white" strokeWidth={2.2} />
                            </div>
                            {item.label}
                          </a>
                        ))}
                        <a
                          href="/servicios"
                          className="block px-3 py-2 text-xs font-medium text-primary hover:underline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Ver todos →
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href="/nosotros"
                  className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nosotros
                </a>
                <a
                  href="/contacto"
                  className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </a>

                <div className="pt-2 px-3">
                  <Button variant="hero" size="default" className="w-full" asChild>
                    <a href="/contacto" onClick={() => setIsMenuOpen(false)}>
                      Agendar Consultoría
                    </a>
                  </Button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
