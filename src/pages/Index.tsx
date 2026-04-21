import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesStrip from "@/components/FeaturesStrip";
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
import SeoHead from "@/components/SeoHead";

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ROICAS",
    url: "https://roicas.com",
    logo: "https://roicas.com/favicon.png",
    description: "Agencia de automatización de marketing B2B en Colombia. Generamos leads cualificados y escalamos negocios con estrategias basadas en datos.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+57-311-456-5403",
      contactType: "sales",
      areaServed: "CO",
      availableLanguage: "Spanish",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CO",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ROICAS",
    url: "https://roicas.com",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "¿En cuánto tiempo empezaré a ver resultados?", acceptedAnswer: { "@type": "Answer", text: "Empezamos a trabajar desde el día 1. En 15-20 días tienes el sistema implementado y funcionando. Las primeras semanas ya recibes leads cualificados, y entre el segundo y tercer mes ves los resultados más significativos." } },
      { "@type": "Question", name: "¿Funciona para una PYME o negocio pequeño?", acceptedAnswer: { "@type": "Answer", text: "Sí. De hecho, los negocios pequeños son los que más se benefician porque no tienen estructura para hacer seguimiento manual. El sistema hace el trabajo de 2-3 personas de ventas a una fracción del costo." } },
      { "@type": "Question", name: "¿Qué pasa si no tengo CRM ni base de datos?", acceptedAnswer: { "@type": "Answer", text: "No necesitas nada. Partimos de cero: configuramos el sistema completo, importamos tus contactos existentes si los tienes, y desde el primer día todos los nuevos leads entran organizados." } },
      { "@type": "Question", name: "¿Cuánto necesito invertir en publicidad?", acceptedAnswer: { "@type": "Answer", text: "Como referencia, recomendamos mínimo $1.000-2.000 USD/mes en pauta para ver resultados consistentes. Lo definimos juntos en la primera llamada según tu mercado específico." } },
      { "@type": "Question", name: "¿Hay permanencia o compromiso largo?", acceptedAnswer: { "@type": "Answer", text: "No. Trabajamos mes a mes porque creemos que si hacemos bien nuestro trabajo, querrás seguir. No necesitamos contratos largos para retenerte — los resultados lo hacen." } },
    ],
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="ROICAS | Agencia de Marketing Automatizado B2B en Colombia"
        description="Generamos leads cualificados y automatizamos tu proceso de ventas. Más de 1.882 leads y 342 keywords en top 3 para nuestros clientes. Sin permanencias."
        canonical="https://roicas.com/"
        schemaJson={homeSchema}
      />
      <Header />
      <HeroSection />
      <FeaturesStrip />
      <LogoBarSection />
      <ProblemSection />
      <ServicesSection />
      <TechStackSection />
      <SuccessStoriesSection />
      <FunnelSection />
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
