import { MotionConfig } from "framer-motion";
import "./roicas-reform.css";
import ProductPage from "./modules/ProductPage";
import Diagnostico from "./modules/diagnostico/pages/Index";
import DiagnosticoPrivacy from "./modules/diagnostico/pages/Privacidad";
import WebExpress from "./modules/web-express/routes/index";
import WebExpressCampaign from "./modules/web-express/routes/black-november";
import WebExpressPrivacy from "./modules/web-express/routes/privacidad";
import WebExpressTerms from "./modules/web-express/routes/terminos";
import WPDoctor from "./pages/WPDoctor";
import "./modules/diagnostico/styles.generated.css";
import "./modules/web-express/styles.generated.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, matchPath, useLocation } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { BookingProvider } from "@/contexts/BookingContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import DisenoWeb from "./pages/services/DisenoWeb";
import TiendasOnline from "./pages/services/TiendasOnline";
import SEO from "./pages/services/SEO";
import PublicidadDigital from "./pages/services/PublicidadDigital";
import AutomatizacionIA from "./pages/services/AutomatizacionIA";
import BriefCotizacion from "./pages/BriefCotizacion";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { publishedArticles } from "@/lib/blog";

const queryClient = new QueryClient();

const siteWhatsAppRoutes = [
  "/",
  "/servicios",
  "/servicios/diseno-web",
  "/servicios/tiendas-online",
  "/servicios/seo",
  "/servicios/publicidad-digital",
  "/servicios/automatizacion-ia",
  "/nosotros",
  "/contacto",
  "/blog",
];

function SiteWhatsApp() {
  const { pathname } = useLocation();
  const article = matchPath("/blog/:slug", pathname);
  const publishedArticle = article && publishedArticles.some(({ slug }) => slug === article.params.slug);
  const showWhatsApp = publishedArticle || siteWhatsAppRoutes.some((route) => matchPath(route, pathname));
  return showWhatsApp ? <WhatsAppButton /> : null;
}

const App = ({ url }: { url?: string }) => {
  const Router = url === undefined ? BrowserRouter : StaticRouter;
  return (
  <MotionConfig reducedMotion="user"><QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router location={url}>
      <ScrollToTop />
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/servicios/diseno-web" element={<DisenoWeb />} />
          <Route path="/servicios/tiendas-online" element={<TiendasOnline />} />
          <Route path="/cotizar-tienda-online" element={<BriefCotizacion />} />
          <Route path="/brief-tienda-online" element={<Navigate to="/cotizar-tienda-online" replace />} />
          <Route path="/servicios/seo" element={<SEO />} />
          <Route path="/servicios/publicidad-digital" element={<PublicidadDigital />} />
          <Route path="/servicios/automatizacion-ia" element={<AutomatizacionIA />} />
          <Route path="/nosotros" element={<AboutUs />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/diagnostico-digital" element={<ProductPage product="diagnostico" title="Diagnóstico digital | Roicas" description="Descubre oportunidades para mejorar tu web, tus campañas y la captación de clientes."><Diagnostico /></ProductPage>} />
          <Route path="/diagnostico-digital/privacidad" element={<ProductPage product="diagnostico" title="Privacidad del diagnóstico digital | Roicas" description="Tratamiento de datos del diagnóstico digital de Roicas."><DiagnosticoPrivacy /></ProductPage>} />
          <Route path="/web-express" element={<ProductPage product="web-express" title="Web Express 24H | Roicas" description="Tu página web profesional con dominio y hosting el primer año. Propuesta en 24 horas hábiles desde el brief completo."><WebExpress /></ProductPage>} />
          <Route path="/web-express/black-november" element={<ProductPage product="web-express" title="Black November — Web Express | Roicas" description="Conoce los planes y condiciones de Black November de Web Express."><WebExpressCampaign /></ProductPage>} />
          <Route path="/web-express/privacidad" element={<ProductPage product="web-express" title="Privacidad — Web Express | Roicas" description="Política de privacidad de Web Express."><WebExpressPrivacy /></ProductPage>} />
          <Route path="/web-express/terminos" element={<ProductPage product="web-express" title="Términos — Web Express | Roicas" description="Alcance, plazos, pagos y condiciones del servicio Web Express."><WebExpressTerms /></ProductPage>} />
          <Route path="/wp-doctor" element={<WPDoctor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SiteWhatsApp />
      </BookingProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider></MotionConfig>
  );
};

export default App;

