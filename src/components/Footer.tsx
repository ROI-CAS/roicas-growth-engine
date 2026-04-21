import { Link } from "react-router-dom";
import logo from "@/assets/logo-roicas.webp";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ROICAS" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/servicios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Servicios
            </Link>
            <Link to="/nosotros" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </Link>
            <Link to="/politica-privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} ROICAS. El marketing que convierte.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;