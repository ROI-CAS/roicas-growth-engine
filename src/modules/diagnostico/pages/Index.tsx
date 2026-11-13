import { lazy, Suspense, type ReactNode } from "react";
import "../styles.generated.css";
import { useScrollDepth } from "@/modules/diagnostico/hooks/use-scroll-depth";
import { Navbar } from "@/modules/diagnostico/components/landing/Navbar";
import { Hero } from "@/modules/diagnostico/components/landing/Hero";

// Below-fold — lazy loaded para no bloquear el render inicial
const QuickCheckup  = lazy(() => import("@/modules/diagnostico/components/landing/QuickCheckup").then(m => ({ default: m.QuickCheckup })));
const PainPoints    = lazy(() => import("@/modules/diagnostico/components/landing/PainPoints").then(m => ({ default: m.PainPoints })));
const Services      = lazy(() => import("@/modules/diagnostico/components/landing/Services").then(m => ({ default: m.Services })));
const Process       = lazy(() => import("@/modules/diagnostico/components/landing/Process").then(m => ({ default: m.Process })));
const Packages      = lazy(() => import("@/modules/diagnostico/components/landing/Packages").then(m => ({ default: m.Packages })));
const Results       = lazy(() => import("@/modules/diagnostico/components/landing/Results").then(m => ({ default: m.Results })));
const Testimonials  = lazy(() => import("@/modules/diagnostico/components/landing/Testimonials").then(m => ({ default: m.Testimonials })));
const Quiz          = lazy(() => import("@/modules/diagnostico/components/landing/Quiz").then(m => ({ default: m.Quiz })));
const Trust         = lazy(() => import("@/modules/diagnostico/components/landing/Trust").then(m => ({ default: m.Trust })));
const Comparison    = lazy(() => import("@/modules/diagnostico/components/landing/Comparison").then(m => ({ default: m.Comparison })));
const FAQ           = lazy(() => import("@/modules/diagnostico/components/landing/FAQ").then(m => ({ default: m.FAQ })));
const Booking       = lazy(() => import("@/modules/diagnostico/components/landing/Booking").then(m => ({ default: m.Booking })));
const FinalCTA      = lazy(() => import("@/modules/diagnostico/components/landing/FinalCTA").then(m => ({ default: m.FinalCTA })));
const Footer        = lazy(() => import("@/modules/diagnostico/components/landing/Footer").then(m => ({ default: m.Footer })));
const WhatsAppFloat = lazy(() => import("@/modules/diagnostico/components/landing/WhatsAppFloat").then(m => ({ default: m.WhatsAppFloat })));
const StickyMobileCTA = lazy(() => import("@/modules/diagnostico/components/landing/StickyMobileCTA").then(m => ({ default: m.StickyMobileCTA })));

const SectionFallback = ({ minHeight = 400 }: { minHeight?: number }) => (
  <div aria-hidden style={{ minHeight }} />
);

const LazySection = ({
  children,
  minHeight,
}: {
  children: ReactNode;
  minHeight?: number;
}) => (
  <Suspense fallback={<SectionFallback minHeight={minHeight} />}>{children}</Suspense>
);

const Index = () => {
  useScrollDepth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <LazySection minHeight={400}><QuickCheckup /></LazySection>
        <LazySection minHeight={500}><Quiz /></LazySection>
        <LazySection minHeight={500}><Booking /></LazySection>
        <div className="container"><h2 className="font-display text-3xl font-semibold text-ink">Cuando decidas implementar</h2><p className="mt-3 max-w-2xl text-lg text-ink-soft">El diagnóstico es el primer paso. Explora nuestros servicios y sus alcances antes de solicitar una propuesta.</p></div>
        <LazySection minHeight={500}><Services /></LazySection>
        <LazySection minHeight={500}><Process /></LazySection>
        <LazySection minHeight={700}><Packages /></LazySection>
        <details className="diagnostic-details container"><summary>Ver casos y referencias de trabajo</summary>
        <LazySection minHeight={500}><Results /></LazySection>
        <LazySection minHeight={500}><Testimonials /></LazySection>
        <LazySection minHeight={400}><Trust /></LazySection>
        </details>
        <details className="diagnostic-details container"><summary>Explorar problemas frecuentes y comparar alternativas</summary>
        <LazySection minHeight={600}><PainPoints /></LazySection>
        <LazySection minHeight={500}><Comparison /></LazySection>
        </details>
        <LazySection minHeight={500}><FAQ /></LazySection>
        <LazySection minHeight={400}><FinalCTA /></LazySection>
      </main>
      <LazySection minHeight={200}><Footer /></LazySection>
      <Suspense fallback={null}>
        <WhatsAppFloat />
        <StickyMobileCTA />
      </Suspense>
    </div>
  );
};

export default Index;
