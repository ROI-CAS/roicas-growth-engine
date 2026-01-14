import logo from "@/assets/logo_roicas.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: "#servicios", label: "Servicios" },
    { href: "#nosotros", label: "Sobre Nosotros" },
    { href: "#contacto", label: "Contacto" },
    { href: "#", label: "Política de Privacidad" },
  ];

  return (
    <footer className="py-12 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} alt="ROICAS" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          </a>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} ROICAS. Resultados, no promesas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
