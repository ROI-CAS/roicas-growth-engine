import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import TechStackSection from "@/components/TechStackSection";
import FunnelSection from "@/components/FunnelSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <TechStackSection />
      <FunnelSection />
      <SuccessStoriesSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <ExitIntentPopup />
      <CookieConsent />
    </main>
  );
};

export default Index;
