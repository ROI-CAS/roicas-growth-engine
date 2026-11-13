import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import FeaturedProject from "@/components/FeaturedProject";
import ProcessSection from "@/components/ProcessSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import FAQSection from "@/components/FAQSection";
import { homeFaqs } from "@/lib/homeFaqs";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const homeSchema = [
  { "@context": "https://schema.org", "@type": "Organization", name: "ROICAS", url: "https://www.roicas.com", logo: "https://www.roicas.com/favicon.png", description: "Desarrollo web, captación de clientes y automatización comercial para empresas en Colombia.", contactPoint: { "@type": "ContactPoint", telephone: "+57-311-456-5403", contactType: "sales", areaServed: "CO", availableLanguage: "Spanish" } },
  { "@context": "https://schema.org", "@type": "WebSite", name: "ROICAS", url: "https://www.roicas.com" },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map(({question,answer}) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background roicas-home">
      <SeoHead
        title="Agencia de marketing digital en Colombia | ROICAS"
        description="Diseño web, SEO, campañas de Google y Meta y automatización con WhatsApp y CRM. Conecta tus canales para atraer clientes y dar seguimiento a cada oportunidad."
        canonical="/"
        schemaJson={homeSchema}
      />
      <Header />
      <main id="contenido-principal">
        <HeroSection />
        <ServicesSection />
        <FeaturedProject />
        <ProcessSection />
        <FAQSection />
        <ContactSection />
        <BlogPreviewSection />
      </main>
      <Footer />
    </div>
  );
}
