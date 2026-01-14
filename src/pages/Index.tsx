import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import TechStackSection from "@/components/TechStackSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <TechStackSection />
      <SuccessStoriesSection />
      <LeadMagnetSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
