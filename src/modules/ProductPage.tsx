import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import SeoHead from "@/components/SeoHead";
import { loadTracking } from "./diagnostico/lib/tracking-loader";
import { initWebExpressTracking } from "./web-express/lib/tracking";
import "./product-landing.css";

export default function ProductPage({ product, title, description, children }: {
  product: "diagnostico" | "web-express"; title: string; description: string; children: ReactNode;
}) {
  const { pathname } = useLocation();
  const scope = useRef<HTMLDivElement>(null);
  const productName = product === "diagnostico" ? "Diagnóstico digital" : "Web Express";

  useEffect(() => {
    scope.current?.classList.add("reveal-js");
    if (product === "diagnostico") loadTracking();
    else initWebExpressTracking();
  }, [product]);

  return (
    <>
      <SeoHead title={title} description={description} canonical={pathname} noindex={pathname.includes("black-november")} />
      <Helmet>
        {product === "diagnostico" && <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600&display=swap" />}
      </Helmet>
      <div ref={scope} className={`${product}-scope`}>
        <nav className="product-bridge" aria-label="Volver a Roicas">
          <div className="product-bridge__inner">
            <Link to="/" className="product-bridge__back"><ArrowLeft size={17} aria-hidden="true" /> Volver a Roicas</Link>
            <span className="product-bridge__name">{productName}</span>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
}
