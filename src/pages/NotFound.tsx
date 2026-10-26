import { Link } from "react-router-dom";
import SeoHead from "@/components/SeoHead";
import logo from "@/assets/logo-roicas.webp";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SeoHead title="Página no encontrada | ROICAS" description="Esta dirección no está disponible. Explora nuestros servicios o contacta a ROICAS." canonical="/404" noindex />
      <div className="text-center px-6">
        <Link to="/"><img src={logo} alt="ROICAS" className="h-12 mx-auto mb-10" /></Link>
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">No encontramos esta página</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
