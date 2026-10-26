import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
