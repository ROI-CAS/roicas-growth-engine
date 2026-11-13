import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import "./roicas-reform.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, matchPath, useLocation } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { BookingProvider } from "@/contexts/BookingContext";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { publishedArticles } from "@/lib/blog";

// Download route code and route-specific styles only when a visitor opens that route.
const ProductPage = lazy(() => import("./modules/ProductPage"));
const Diagnostico = lazy(() => import("./modules/diagnostico/pages/Index"));
const DiagnosticoPrivacy = lazy(() => import("./modules/diagnostico/pages/Privacidad"));
const WebExpress = lazy(() => import("./modules/web-express/routes/index"));
const WebExpressCampaign = lazy(() => import("./modules/web-express/routes/black-november"));
const WebExpressPrivacy = lazy(() => import("./modules/web-express/routes/privacidad"));
const WebExpressTerms = lazy(() => import("./modules/web-express/routes/terminos"));
const WPDoctor = lazy(() => import("./pages/WPDoctor"));
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DisenoWeb = lazy(() => import("./pages/services/DisenoWeb"));
const TiendasOnline = lazy(() => import("./pages/services/TiendasOnline"));
const SEO = lazy(() => import("./pages/services/SEO"));
const PublicidadDigital = lazy(() => import("./pages/services/PublicidadDigital"));
const AutomatizacionIA = lazy(() => import("./pages/services/AutomatizacionIA"));
const BriefCotizacion = lazy(() => import("./pages/BriefCotizacion"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));

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
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
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
        </Suspense>
        <SiteWhatsApp />
      </BookingProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider></MotionConfig>
  );
};

export default App;

