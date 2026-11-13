import { Link } from "react-router-dom";
import logo from "@/assets/logo-roicas.webp";
import "./site-navigation.css";

export default function Footer() {
  return (
    <footer className="roicas-footer roicas-site-footer">
      <div className="section-container">
        <div className="roicas-footer-grid">
          <div>
            <Link to="/" aria-label="Roicas, inicio"><img src={logo} width={160} height={48} alt="ROICAS" className="h-10 w-auto" /></Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Diseño web, marketing digital y automatización para empresas en Colombia.</p>
          </div>
          <nav aria-label="Servicios en el pie de página">
            <h2>Servicios</h2>
            <ul>
              <li><Link to="/servicios">Ver todos los servicios</Link></li>
              <li><Link to="/servicios/diseno-web">Diseño web</Link></li>
              <li><Link to="/servicios/tiendas-online">Tiendas online</Link></li>
              <li><Link to="/servicios/seo">SEO</Link></li>
              <li><Link to="/servicios/publicidad-digital">Publicidad digital</Link></li>
              <li><Link to="/servicios/automatizacion-ia">Automatización con IA</Link></li>
            </ul>
          </nav>
          <nav aria-label="Información de Roicas">
            <h2>Roicas</h2>
            <ul>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </nav>
          <nav aria-label="Canales de contacto">
            <h2>Hablemos</h2>
            <ul>
              <li><a href="mailto:hola@roicas.com">hola@roicas.com</a></li>
              <li><a href="tel:+573114565403">+57 311 456 5403</a></li>
              <li><a href="https://wa.me/573114565403" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></li>
            </ul>
          </nav>
        </div>
        <div className="roicas-footer-bottom">
          <p>© {new Date().getFullYear()} ROICAS · Colombia</p>
          <Link to="/politica-privacidad">Política de privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

