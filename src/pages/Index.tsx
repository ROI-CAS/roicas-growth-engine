import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LogoBarSection from "@/components/LogoBarSection";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import TechStackSection from "@/components/TechStackSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import FAQSection from "@/components/FAQSection";
import FunnelSection from "@/components/FunnelSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* 1. Hero — propuesta inmediata + dual CTA */}
      <HeroSection />
      {/* 2. Logos — prueba social inmediata post-hero */}
      <LogoBarSection />
      {/* 3. Problema — empatía con el visitante */}
      <ProblemSection />
      {/* 4. Solución — 3 paquetes con nivel y promesa */}
      <ServicesSection />
      {/* 5. Cómo funciona — pipeline de 5 pasos */}
      <TechStackSection />
      {/* 6. Resultados — casos de éxito con números */}
      <SuccessStoriesSection />
      {/* 7. Métricas del embudo */}
      <FunnelSection />
      {/* 8. FAQ — justo antes de la decisión */}
      <FAQSection />
      {/* 9. CTA final — formulario 3 campos */}
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <ExitIntentPopup />
      <CookieConsent />
    </main>
  );
};

export default Index;
