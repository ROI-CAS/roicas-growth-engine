import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import "./editorial.css";

export default function NotFound() {
  return (
    <div className="roicas-editorial">
      <SeoHead title="Página no encontrada | ROICAS" description="Esta dirección no está disponible. Explora nuestros servicios o contacta a ROICAS." canonical="/404" noindex />
      <Header />
      <main id="contenido-principal" tabIndex={-1} className="red-hero red-hero-compact red-missing">
        <ParticlesBackground particleCount={20} speed={0.16} />
        <div className="section-container red-hero-content">
          <h1>No encontramos esta página</h1>
          <p>Comprueba la dirección o vuelve al inicio para encontrar lo que buscas.</p>
          <div className="red-actions">
            <Link className="red-action" to="/"><ArrowLeft size={17} aria-hidden="true" />Volver al inicio</Link>
            <Link className="red-action red-action-outline" to="/servicios">Ver servicios<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

